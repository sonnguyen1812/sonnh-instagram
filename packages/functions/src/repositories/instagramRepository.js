// packages/functions/src/repositories/instagramRepository.js
import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
const instagramConfigRef = firestore.collection('instagramConfig');
const instagramAuthRef = firestore.collection('instagramAuth');
const instagramMediaRef = firestore.collection('instagramMedia');

export const getFeedConfig = async shopId => {
  const snapshot = await instagramConfigRef
    .where('shopId', '==', shopId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))[0];
};

export const getFeedConfigByShopDomain = async shopDomain => {
  console.log('Getting feed config for shop:', shopDomain);

  const snapshot = await instagramConfigRef
    .where('shopDomain', '==', shopDomain)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const config = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))[0];

  return config;
};

export const updateFeedConfig = async (shopId, updateInfo) => {
  try {
    // Validate input parameters
    if (!shopId) {
      throw new Error('Shop ID is required');
    }
    if (!updateInfo || Object.keys(updateInfo).length === 0) {
      throw new Error('Update information is required');
    }

    // Get existing config
    const configDoc = await getFeedConfig(shopId);
    if (!configDoc) {
      throw new Error(`Feed configuration not found for shop ID: ${shopId}`);
    }

    // Update document
    await instagramConfigRef.doc(configDoc.id).update({...updateInfo});
    console.log('Feed config updated successfully for shop:', shopId);

    // Return updated document
    return {
      id: configDoc.id,
      ...configDoc,
      ...updateInfo
    };
  } catch (error) {
    console.error('Error updating feed config:', {
      shopId,
      error: error.message,
      stack: error.stack
    });

    // Throw custom error with more context
    throw new Error(`Failed to update feed config: ${error.message}`);
  }
};

export const addFeedConfig = async ({shopDomain, shopId, addInfo}) => {
  console.log('Adding feed config:', addInfo);

  const snapshot = await instagramConfigRef
    .where('shopDomain', '==', shopDomain)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    // Nếu có doc cũ, update với default config
    const docId = snapshot.docs[0].id;
    await instagramConfigRef.doc(docId).set(
      {
        shopDomain,
        shopId,
        ...addInfo
      },
      {merge: false}
    ); // merge: false để override hết data cũ

    return docId;
  }

  // Nếu không có doc cũ, tạo mới
  const docRef = await instagramConfigRef.add({
    shopDomain,
    shopId,
    ...addInfo
  });

  return docRef.id;
};

// Lưu Instagram token và user info
export const addOrUpdateAuth = async ({
  shopId,
  userId,
  accessToken,
  permissions,
  expiresIn,
  username
}) => {
  try {
    const snapshot = await instagramAuthRef
      .where('shopId', '==', shopId)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      await instagramAuthRef.doc(docId).set(
        {
          userId,
          accessToken,
          instagramConnected: true,
          shopId,
          username,
          permissions,
          expiresIn,
          updatedAt: new Date()
        },
        {merge: false}
      );
      return {
        success: true,
        docId
      };
    }

    const docRef = await instagramAuthRef.add({
      userId,
      username,
      permissions,
      accessToken,
      instagramConnected: true,
      shopId,
      expiresIn,
      updatedAt: new Date()
    });

    return {
      success: true,
      docId: docRef.id
    };
  } catch (error) {
    console.error('Error saving Instagram auth:', error);
    throw new Error(`Failed to save Instagram auth: ${error.message}`);
  }
};

// Lưu/cập nhật media list
export const addOrUpdateMedia = async ({shopId, userId, username, mediaList}) => {
  try {
    if (!shopId || !userId || !username || !mediaList) {
      throw new Error('Missing required parameters: shopId, userId, mediaList');
    }

    // Sử dụng instagramUserId làm document ID
    const docRef = instagramMediaRef.doc(userId);

    // Lấy document hiện tại để kiểm tra
    const doc = await docRef.get();

    if (doc.exists) {
      // Nếu document đã tồn tại, update
      await docRef.update({
        shopId,
        username,
        mediaList,
        updatedAt: new Date()
      });
    } else {
      // Nếu chưa tồn tại, tạo mới
      await docRef.set({
        shopId,
        username,
        mediaList,
        createdAt: new Date()
      });
    }

    return {
      success: true,
      docId: userId
    };
  } catch (error) {
    console.error('Error updating Instagram media:', error);
    throw new Error(`Failed to update Instagram media: ${error.message}`);
  }
};

// Lấy thông tin Instagram đã lưu
export const getAuth = async shopId => {
  try {
    const snapshot = await instagramAuthRef
      .where('shopId', '==', shopId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs[0].data();
    return {
      userId: data.userId,
      username: data.username,
      accessToken: data.accessToken,
      instagramConnected: data.instagramConnected,
      shopId: data.shopId,
      permissions: data.permissions,
      expiresIn: data.expiresIn,
      lastMediaUpdate: data.lastMediaUpdate
    };
  } catch (error) {
    console.error('Error getting Instagram info:', error);
    throw new Error(`Failed to get Instagram info: ${error.message}`);
  }
};

// Lấy thông tin media đã lưu
export const getMedia = async shopId => {
  try {
    if (!shopId) {
      throw new Error('Shop ID is required');
    }

    // Lấy document theo shopId
    const snapshot = await instagramMediaRef
      .where('shopId', '==', shopId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs[0].data();

    return {
      mediaList: data.mediaList || [],
      shopId: data.shopId,
      updatedAt: data.updatedAt
    };
  } catch (error) {
    console.error('Error getting Instagram media:', error);
    throw new Error(`Failed to get Instagram media: ${error.message}`);
  }
};

export const disconnectAuth = async shopId => {
  try {
    const snapshot = await instagramAuthRef
      .where('shopId', '==', shopId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const docId = snapshot.docs[0].id;
    await instagramAuthRef.doc(docId).delete();

    return {
      success: true,
      message: 'Instagram disconnected successfully'
    };
  } catch (error) {
    console.error('Error disconnecting Instagram:', error);
    throw new Error(`Failed to disconnect Instagram: ${error.message}`);
  }
};
