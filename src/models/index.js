// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const RentStatus = {
  "AVAILABLE": "AVAILABLE",
  "UNAVAILABLE": "UNAVAILABLE",
  "PAID": "PAID"
};

const AppStatus = {
  "USER": "USER",
  "HOST": "HOST"
};

const { TotalViews, UniqueViews, ObservePayment, Apartment, ObserveHostPayment, AllReviews, PaymentHistory, CardDetails, HostAccount, UserAuth, WishList, Review, Payment, User, Host } = initSchema(schema);

export {
  TotalViews,
  UniqueViews,
  ObservePayment,
  Apartment,
  ObserveHostPayment,
  AllReviews,
  PaymentHistory,
  CardDetails,
  HostAccount,
  UserAuth,
  WishList,
  Review,
  Payment,
  User,
  Host,
  RentStatus,
  AppStatus
};