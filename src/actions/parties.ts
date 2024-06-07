import {
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import api from 'src/api/api';
import {db} from '../../firebaseConfig';
import socket from 'src/utils/socket';

export const fetchParties = async () => {
  try {
    const res = await api.get({
      url: 'parties',
      authorization: true,
    });
    return res.data.parties;
  } catch (error) {
    return error;
  }
};

export const fetchPartyDetails = async (partyId: string) => {
  try {
    const res = await api.get({
      url: `parties/party-details/${partyId}`,
      authorization: true,
    });
    return res.data.parties;
  } catch (error) {
    return error;
  }
};

export const fetchPosts = async () => {
  try {
    const res = await api.get({
      url: 'users/post',
      authorization: true,
    });
    return res?.data?.posts;
  } catch (error) {
    return error;
  }
};

export const leaveParty = async (partyId: string, user: any) => {
  try {
    socket.emit('leave_party', {
      party: partyId,
      user,
    });
    await api.post({
      url: `parties/leave/${partyId}`,
      requiresToken: true,
      authorization: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const partyCollection = collection(db, 'party');

export const createFireStoreParties = async (data: {
  partyId: string;
  artist: string;
  partyName: string;
  partyType: string;
}) => {
  const party = {
    partyId: data?.partyId,
    artist: data?.artist,
    partyName: data?.partyName,
    partyType: data?.partyType,
  };
  // Use setDoc with a specific document ID
  const partyRef = doc(partyCollection, data?.partyId);
  try {
    const response = await setDoc(partyRef, party);
    console.log('response', response);
  } catch (error) {
    console.log(error);
  }
};

export type FireStoreComments = {
  commentId: string;
  userId: string;
  text: string;
  imageUri: string;
  likes: string[];
  timestamp: string;
};

export const createFireStoreComments = async (
  partyId: string,
  userId: string,
  text: string,
  imageUri: string,
) => {
  // Reference to the specific party's comments subcollection
  const commentCollection = collection(db, `party/${partyId}/comments`);

  // Creating the comment object
  const comment = {
    partyId,
    userId,
    timestamp: Timestamp.fromDate(new Date()),
    text,
    imageUri,
    likes: [],
  };

  // Adding the comment to the subcollection
  try {
    const response = await addDoc(commentCollection, comment);
    console.log('response', response);
  } catch (error) {
    console.log(error);
  }
};

export const likeComment = async (
  partyId: string,
  commentId: string,
  userId: string,
) => {
  const commentDoc = doc(db, `party/${partyId}/comments/${commentId}`);

  try {
    await updateDoc(commentDoc, {
      likes: arrayUnion(userId),
    });
  } catch (error) {
    console.log(error);
  }
};

export const unlikeComment = async (
  partyId: string,
  commentId: string,
  userId: string,
) => {
  const commentDoc = doc(db, `party/${partyId}/comments/${commentId}`);

  try {
    await updateDoc(commentDoc, {
      likes: arrayRemove(userId),
    });
  } catch (error) {
    console.log(error);
  }
};
