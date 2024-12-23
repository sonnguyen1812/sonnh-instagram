// packages/functions/src/repositories/instagramRepository.js
import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
const instagramFeedRef = firestore.collection('instagramFeed');

export const getFeedConfig = async shopId => {
  const snapshot = await instagramFeedRef
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

// packages/functions/src/repositories/instagramRepository.js
export const getFeedConfigByShopDomain = async shopDomain => {
  console.log('Getting feed config for shop:', shopDomain);

  const snapshot = await instagramFeedRef
    .where('shopDomain', '==', shopDomain)
    .limit(1)
    .get();

  console.log('Snapshot empty:', snapshot.empty);
  if (snapshot.empty) {
    return null;
  }

  const config = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))[0];

  console.log('Found config:', config);
  return config;
};

export const updateFeedConfig = async (shopId, updateInfo) => {
  const configDoc = await getFeedConfig(shopId);
  return await instagramFeedRef.doc(configDoc.id).update({...updateInfo});
};

export const addFeedConfig = async ({shopDomain, shopId, addInfo}) => {
  console.log('Adding feed config:', addInfo);

  // Check có doc cũ không
  const snapshot = await instagramFeedRef
    .where('shopDomain', '==', shopDomain)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    // Nếu có doc cũ, update với default config
    const docId = snapshot.docs[0].id;
    await instagramFeedRef.doc(docId).set(
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
  const docRef = await instagramFeedRef.add({
    shopDomain,
    shopId,
    ...addInfo
  });

  return docRef.id;
};
