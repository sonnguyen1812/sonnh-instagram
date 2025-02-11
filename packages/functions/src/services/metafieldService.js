import {isEmpty} from '@avada/utils';
import {makeGraphQlApi} from '../helpers/api';

import {META_FIELD_NAMESPACE} from '../const/metafields';
import {getShopById} from '@avada/shopify-auth';
import Shopify from 'shopify-api-node';

/**
 *
 * @param shopId
 * @param changeAccount
 * @returns {Promise<void>}
 */
export async function updateMetaField(shopId, changeAccount = false) {
  const shop = await getShopById(shopId);
  const shopify = new Shopify({
    shopName: shop.shopifyDomain,
    accessToken: shop.accessToken
  });

  await Promise.all([
    createOrUpdateMetaField({
      shopify,
      value: {
        shopId
      }
    })
  ]);
}

export const upsertMetaField = async ({shopId, namespace, value, key}) => {
  const shop = await getShopById(shopId);
  const shopify = new Shopify({
    shopName: shop.shopifyDomain,
    accessToken: shop.accessToken
  });

  await createOrUpdateMetaField({
    shopify,
    namespace,
    key,
    value
  });
};

/**
 *
 * @param namespace
 * @param value
 * @param key
 * @param shopify
 * @returns {Promise<void>}
 */
export async function createOrUpdateMetaField({value, shopify, namespace, key}) {
  const {shopName: shopifyDomain, accessToken} = shopify.options;
  const metafieldOwner = {namespace, key};
  const metafieldData = {value: JSON.stringify(value), type: 'json'};
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid metafield value');
  }

  const metafields = await shopify.metafield.list(metafieldOwner);

  if (isEmpty(metafields)) {
    console.log('Create metafield for', shopifyDomain);
    await shopify.metafield.create({...metafieldOwner, ...metafieldData});
    console.log('Metafield created successfully');
  } else {
    console.log('Update metafield for', shopifyDomain, metafieldOwner);
    await Promise.all(metafields.map(({id}) => shopify.metafield.update(id, metafieldData)));
    console.log('Metafield updated successfully');
  }

  // Expose metafield sau khi đã create/update
  if (namespace === META_FIELD_NAMESPACE) {
    await exposeMetafield({shopifyDomain, accessToken, namespace, key});
    console.log('Expose metafield done');
  }
}

/**
 *
 * @param shopify
 * @param namespace
 * @param key
 * @returns {Promise<void>}
 */
export async function deleteMetaField(
  shopify,
  namespace = META_FIELD_NAMESPACE,
  key = META_FIELD_NAMESPACE
) {
  const metafieldOwner = {namespace, key};
  const metafields = await shopify?.metafield.list(metafieldOwner);

  if (!isEmpty(metafields)) {
    await Promise.all(metafields.map(({id}) => shopify.metafield.delete(id)));
  }

  console.log('Delete metafield done');
}

/**
 * Exposing the meta field to the storefront API
 * @link https://shopify.dev/docs/custom-storefronts/building-with-the-storefront-api/products-collections/metafields#step-1-expose-metafields
 *
 * @param accessToken
 * @param shopifyDomain
 * @param namespace
 * @param key
 * @return {Promise<*>}
 */
export async function exposeMetafield({accessToken, shopifyDomain, namespace, key}) {
  try {
    if (!namespace || !key) {
      console.error('Missing required params namespace or key:', {namespace, key});
      return;
    }

    if (!accessToken || !shopifyDomain) {
      console.error('Missing required params accessToken or shopifyDomain:', {
        accessToken,
        shopifyDomain
      });
      return;
    }

    // 1. Kiểm tra definition
    const checkDefinitionQuery = {
      query: `
        query {
          metafieldDefinitions(first: 10, ownerType: SHOP) {
            nodes {
              id
              name
              namespace
              key
            }
          }
        }
      `
    };

    const definitionCheck = await makeGraphQlApi({
      accessToken,
      shopifyDomain,
      graphqlQuery: checkDefinitionQuery
    });

    console.log('Current definitions:', definitionCheck?.data?.metafieldDefinitions?.nodes);

    const definitionExists = definitionCheck?.data?.metafieldDefinitions?.nodes?.some(
      node => node.namespace === namespace && node.key === key
    );

    // 2. Tạo definition nếu chưa tồn tại
    if (!definitionExists) {
      const createDefinitionQuery = {
        query: `
          mutation createMetafieldDefinition($definition: MetafieldDefinitionInput!) {
            metafieldDefinitionCreate(definition: $definition) {
              createdDefinition {
                id
                name
                namespace
                key
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          definition: {
            name: key,
            namespace: namespace,
            key: key,
            description: 'Instagram Feed Configuration',
            type: 'json',
            ownerType: 'SHOP',
            pin: true
          }
        }
      };

      const definitionResponse = await makeGraphQlApi({
        accessToken,
        shopifyDomain,
        graphqlQuery: createDefinitionQuery
      });

      console.log('Definition creation response:', definitionResponse);

      if (definitionResponse?.data?.metafieldDefinitionCreate?.userErrors?.length > 0) {
        console.error(
          'Failed to create definition:',
          definitionResponse.data.metafieldDefinitionCreate.userErrors
        );
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    const checkVisibilityQuery = {
      query: `
        query {
          metafieldStorefrontVisibilities(first: 10) {
            nodes {
              id
              namespace
              key
            }
          }
        }
      `
    };

    const visibilityResponse = await makeGraphQlApi({
      accessToken,
      shopifyDomain,
      graphqlQuery: checkVisibilityQuery
    });

    console.log(
      'Current visibility:',
      visibilityResponse?.data?.metafieldStorefrontVisibilities?.nodes
    );

    const existingVisibility = visibilityResponse?.data?.metafieldStorefrontVisibilities?.nodes?.find(
      node => node.namespace === namespace && node.key === key
    );

    if (existingVisibility) {
      const deleteVisibilityQuery = {
        query: `
          mutation metafieldStorefrontVisibilityDelete($id: ID!) {
            metafieldStorefrontVisibilityDelete(id: $id) {
              deletedMetafieldStorefrontVisibilityId
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          id: existingVisibility.id
        }
      };

      await makeGraphQlApi({
        accessToken,
        shopifyDomain,
        graphqlQuery: deleteVisibilityQuery
      });

      console.log('Deleted existing visibility');
    }

    // Expose metafield
    const exposeQuery = {
      query: `
        mutation metafieldStorefrontVisibilityCreate($input: MetafieldStorefrontVisibilityInput!) {
          metafieldStorefrontVisibilityCreate(input: $input) {
            metafieldStorefrontVisibility {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          namespace: namespace,
          key: key,
          ownerType: 'SHOP'
        }
      }
    };

    const response = await makeGraphQlApi({accessToken, shopifyDomain, graphqlQuery: exposeQuery});

    if (response?.data?.metafieldStorefrontVisibilityCreate?.userErrors?.length > 0) {
      console.error(
        'Expose metafield errors:',
        response.data.metafieldStorefrontVisibilityCreate.userErrors
      );
      return;
    }

    console.log('Expose metafield success: ');
    console.dir(response, {depth: null});
    return response;
  } catch (e) {
    console.error('Failed to expose metafield', e);
    throw e;
  }
}
