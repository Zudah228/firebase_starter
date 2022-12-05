import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { getStorage } from "firebase-admin/storage";
import * as functions from "firebase-functions";

const CLOUD_FUNCTIONS_REGION = "asia-northeast1";

export const endpoint = functions.region(CLOUD_FUNCTIONS_REGION);

export const getAdminFirestore = getFirestore;
export const getAdminAuth = getAuth;
export const getAdminStorage = getStorage;
export const getAdminMessaging = getMessaging;
