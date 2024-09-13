import { ref, set, get, push, update, remove } from "firebase/database";
import { database } from "../firebaseConfig";

export const writeUserData = (userId, name, email) => {
  set(ref(database, 'users/' + userId), {
    username: name,
    email: email,
  });
};

export const readUserData = async (userId) => {
  const snapshot = await get(ref(database, 'users/' + userId));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

export const updateUserData = (userId, updates) => {
  update(ref(database, 'users/' + userId), updates);
};

export const deleteUserData = (userId) => {
  remove(ref(database, 'users/' + userId));
};

export const createGoal = (userId, goalData) => {
  const newGoalKey = push(ref(database, 'goals/' + userId)).key;
  set(ref(database, 'goals/' + userId + '/' + newGoalKey), goalData);
  return newGoalKey;
};

export const readGoals = async (userId) => {
  const snapshot = await get(ref(database, 'goals/' + userId));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

export const deleteGoal = (userId, goalId) => {
  return remove(ref(database, `goals/${userId}/${goalId}`));
};

export const updateGoal = (userId, goalId, updates) => {
  return update(ref(database, `goals/${userId}/${goalId}`), updates);
};
