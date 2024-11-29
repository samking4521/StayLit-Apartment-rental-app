import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum RentStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
  PAID = "PAID"
}

export enum AppStatus {
  USER = "USER",
  HOST = "HOST"
}



type EagerTotalViews = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TotalViews, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly apartmentID?: string | null;
  readonly finalViewCount?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTotalViews = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<TotalViews, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly apartmentID?: string | null;
  readonly finalViewCount?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type TotalViews = LazyLoading extends LazyLoadingDisabled ? EagerTotalViews : LazyTotalViews

export declare const TotalViews: (new (init: ModelInit<TotalViews>) => TotalViews) & {
  copyOf(source: TotalViews, mutator: (draft: MutableModel<TotalViews>) => MutableModel<TotalViews> | void): TotalViews;
}

type EagerUniqueViews = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UniqueViews, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userID?: string | null;
  readonly apartmentID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUniqueViews = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UniqueViews, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userID?: string | null;
  readonly apartmentID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UniqueViews = LazyLoading extends LazyLoadingDisabled ? EagerUniqueViews : LazyUniqueViews

export declare const UniqueViews: (new (init: ModelInit<UniqueViews>) => UniqueViews) & {
  copyOf(source: UniqueViews, mutator: (draft: MutableModel<UniqueViews>) => MutableModel<UniqueViews> | void): UniqueViews;
}

type EagerObservePayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ObservePayment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly discount?: boolean | null;
  readonly newPayment?: boolean | null;
  readonly userID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyObservePayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ObservePayment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly discount?: boolean | null;
  readonly newPayment?: boolean | null;
  readonly userID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ObservePayment = LazyLoading extends LazyLoadingDisabled ? EagerObservePayment : LazyObservePayment

export declare const ObservePayment: (new (init: ModelInit<ObservePayment>) => ObservePayment) & {
  copyOf(source: ObservePayment, mutator: (draft: MutableModel<ObservePayment>) => MutableModel<ObservePayment> | void): ObservePayment;
}

type EagerApartment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Apartment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly shareStatus?: string | null;
  readonly placeType?: string | null;
  readonly bedroom?: number | null;
  readonly bathroom?: number | null;
  readonly electricity?: string | null;
  readonly water?: string | null;
  readonly pop?: string | null;
  readonly wardrobe?: string | null;
  readonly lat?: number | null;
  readonly lng?: number | null;
  readonly address?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly country?: string | null;
  readonly apartmentTitle?: string | null;
  readonly apartmentDesc?: string | null;
  readonly price?: number | null;
  readonly formattedPrice?: string | null;
  readonly leaseDuration?: string | null;
  readonly date?: string | null;
  readonly status?: RentStatus | keyof typeof RentStatus | null;
  readonly security?: string | null;
  readonly key?: string | null;
  readonly addressText?: string | null;
  readonly hostID?: string | null;
  readonly coverPhotoKey?: string | null;
  readonly uniqueViewCount?: number | null;
  readonly moveInCost?: string | null;
  readonly parkingSpace?: string | null;
  readonly moveInCostInt?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyApartment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Apartment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly shareStatus?: string | null;
  readonly placeType?: string | null;
  readonly bedroom?: number | null;
  readonly bathroom?: number | null;
  readonly electricity?: string | null;
  readonly water?: string | null;
  readonly pop?: string | null;
  readonly wardrobe?: string | null;
  readonly lat?: number | null;
  readonly lng?: number | null;
  readonly address?: string | null;
  readonly city?: string | null;
  readonly state?: string | null;
  readonly country?: string | null;
  readonly apartmentTitle?: string | null;
  readonly apartmentDesc?: string | null;
  readonly price?: number | null;
  readonly formattedPrice?: string | null;
  readonly leaseDuration?: string | null;
  readonly date?: string | null;
  readonly status?: RentStatus | keyof typeof RentStatus | null;
  readonly security?: string | null;
  readonly key?: string | null;
  readonly addressText?: string | null;
  readonly hostID?: string | null;
  readonly coverPhotoKey?: string | null;
  readonly uniqueViewCount?: number | null;
  readonly moveInCost?: string | null;
  readonly parkingSpace?: string | null;
  readonly moveInCostInt?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Apartment = LazyLoading extends LazyLoadingDisabled ? EagerApartment : LazyApartment

export declare const Apartment: (new (init: ModelInit<Apartment>) => Apartment) & {
  copyOf(source: Apartment, mutator: (draft: MutableModel<Apartment>) => MutableModel<Apartment> | void): Apartment;
}

type EagerObserveHostPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ObserveHostPayment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly newPayment?: boolean | null;
  readonly hostID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyObserveHostPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ObserveHostPayment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly newPayment?: boolean | null;
  readonly hostID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ObserveHostPayment = LazyLoading extends LazyLoadingDisabled ? EagerObserveHostPayment : LazyObserveHostPayment

export declare const ObserveHostPayment: (new (init: ModelInit<ObserveHostPayment>) => ObserveHostPayment) & {
  copyOf(source: ObserveHostPayment, mutator: (draft: MutableModel<ObserveHostPayment>) => MutableModel<ObserveHostPayment> | void): ObserveHostPayment;
}

type EagerAllReviews = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AllReviews, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly starLength?: number | null;
  readonly reviewDesc?: string | null;
  readonly date?: string | null;
  readonly userID?: string | null;
  readonly hostID?: string | null;
  readonly apartmentID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyAllReviews = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AllReviews, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly starLength?: number | null;
  readonly reviewDesc?: string | null;
  readonly date?: string | null;
  readonly userID?: string | null;
  readonly hostID?: string | null;
  readonly apartmentID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type AllReviews = LazyLoading extends LazyLoadingDisabled ? EagerAllReviews : LazyAllReviews

export declare const AllReviews: (new (init: ModelInit<AllReviews>) => AllReviews) & {
  copyOf(source: AllReviews, mutator: (draft: MutableModel<AllReviews>) => MutableModel<AllReviews> | void): AllReviews;
}

type EagerPaymentHistory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PaymentHistory, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly price?: number | null;
  readonly hostID?: string | null;
  readonly apartmentID?: string | null;
  readonly userID?: string | null;
  readonly LeotServiceFee?: number | null;
  readonly HostIncome?: number | null;
  readonly date?: string | null;
  readonly status?: string | null;
  readonly type?: string | null;
  readonly reference?: string | null;
  readonly User?: string | null;
  readonly Host?: string | null;
  readonly Apartment?: string | null;
  readonly Review?: string | null;
  readonly TotalViews?: number | null;
  readonly UniqueViews?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPaymentHistory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PaymentHistory, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly price?: number | null;
  readonly hostID?: string | null;
  readonly apartmentID?: string | null;
  readonly userID?: string | null;
  readonly LeotServiceFee?: number | null;
  readonly HostIncome?: number | null;
  readonly date?: string | null;
  readonly status?: string | null;
  readonly type?: string | null;
  readonly reference?: string | null;
  readonly User?: string | null;
  readonly Host?: string | null;
  readonly Apartment?: string | null;
  readonly Review?: string | null;
  readonly TotalViews?: number | null;
  readonly UniqueViews?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PaymentHistory = LazyLoading extends LazyLoadingDisabled ? EagerPaymentHistory : LazyPaymentHistory

export declare const PaymentHistory: (new (init: ModelInit<PaymentHistory>) => PaymentHistory) & {
  copyOf(source: PaymentHistory, mutator: (draft: MutableModel<PaymentHistory>) => MutableModel<PaymentHistory> | void): PaymentHistory;
}

type EagerCardDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CardDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cardOwnerName?: string | null;
  readonly cardNumber?: string | null;
  readonly cardExpiryDate?: string | null;
  readonly cardCVV?: string | null;
  readonly userID?: string | null;
  readonly authorization?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCardDetails = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CardDetails, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cardOwnerName?: string | null;
  readonly cardNumber?: string | null;
  readonly cardExpiryDate?: string | null;
  readonly cardCVV?: string | null;
  readonly userID?: string | null;
  readonly authorization?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CardDetails = LazyLoading extends LazyLoadingDisabled ? EagerCardDetails : LazyCardDetails

export declare const CardDetails: (new (init: ModelInit<CardDetails>) => CardDetails) & {
  copyOf(source: CardDetails, mutator: (draft: MutableModel<CardDetails>) => MutableModel<CardDetails> | void): CardDetails;
}

type EagerHostAccount = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<HostAccount, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly accountName?: string | null;
  readonly accountNo?: string | null;
  readonly bankName?: string | null;
  readonly hostID?: string | null;
  readonly bankCode?: string | null;
  readonly subaccountCode?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyHostAccount = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<HostAccount, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly accountName?: string | null;
  readonly accountNo?: string | null;
  readonly bankName?: string | null;
  readonly hostID?: string | null;
  readonly bankCode?: string | null;
  readonly subaccountCode?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type HostAccount = LazyLoading extends LazyLoadingDisabled ? EagerHostAccount : LazyHostAccount

export declare const HostAccount: (new (init: ModelInit<HostAccount>) => HostAccount) & {
  copyOf(source: HostAccount, mutator: (draft: MutableModel<HostAccount>) => MutableModel<HostAccount> | void): HostAccount;
}

type EagerUserAuth = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserAuth, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email?: string | null;
  readonly password?: string | null;
  readonly signInStatus?: string | null;
  readonly sub?: string | null;
  readonly userAppType?: AppStatus | keyof typeof AppStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUserAuth = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserAuth, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email?: string | null;
  readonly password?: string | null;
  readonly signInStatus?: string | null;
  readonly sub?: string | null;
  readonly userAppType?: AppStatus | keyof typeof AppStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UserAuth = LazyLoading extends LazyLoadingDisabled ? EagerUserAuth : LazyUserAuth

export declare const UserAuth: (new (init: ModelInit<UserAuth>) => UserAuth) & {
  copyOf(source: UserAuth, mutator: (draft: MutableModel<UserAuth>) => MutableModel<UserAuth> | void): UserAuth;
}

type EagerWishList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WishList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly apartmentId?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyWishList = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WishList, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly apartmentId?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type WishList = LazyLoading extends LazyLoadingDisabled ? EagerWishList : LazyWishList

export declare const WishList: (new (init: ModelInit<WishList>) => WishList) & {
  copyOf(source: WishList, mutator: (draft: MutableModel<WishList>) => MutableModel<WishList> | void): WishList;
}

type EagerReview = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Review, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly starLength?: number | null;
  readonly reviewDesc?: string | null;
  readonly date?: string | null;
  readonly apartmentID?: string | null;
  readonly userID?: string | null;
  readonly hostID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyReview = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Review, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly starLength?: number | null;
  readonly reviewDesc?: string | null;
  readonly date?: string | null;
  readonly apartmentID?: string | null;
  readonly userID?: string | null;
  readonly hostID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Review = LazyLoading extends LazyLoadingDisabled ? EagerReview : LazyReview

export declare const Review: (new (init: ModelInit<Review>) => Review) & {
  copyOf(source: Review, mutator: (draft: MutableModel<Review>) => MutableModel<Review> | void): Review;
}

type EagerPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Payment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly price?: number | null;
  readonly hostID?: string | null;
  readonly apartmentID?: string | null;
  readonly userID?: string | null;
  readonly LeotServiceFee?: number | null;
  readonly HostIncome?: number | null;
  readonly date?: string | null;
  readonly status?: string | null;
  readonly type?: string | null;
  readonly reference?: string | null;
  readonly User?: string | null;
  readonly Host?: string | null;
  readonly Apartment?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPayment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Payment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly price?: number | null;
  readonly hostID?: string | null;
  readonly apartmentID?: string | null;
  readonly userID?: string | null;
  readonly LeotServiceFee?: number | null;
  readonly HostIncome?: number | null;
  readonly date?: string | null;
  readonly status?: string | null;
  readonly type?: string | null;
  readonly reference?: string | null;
  readonly User?: string | null;
  readonly Host?: string | null;
  readonly Apartment?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Payment = LazyLoading extends LazyLoadingDisabled ? EagerPayment : LazyPayment

export declare const Payment: (new (init: ModelInit<Payment>) => Payment) & {
  copyOf(source: Payment, mutator: (draft: MutableModel<Payment>) => MutableModel<Payment> | void): Payment;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly dob?: string | null;
  readonly state?: string | null;
  readonly country?: string | null;
  readonly email?: string | null;
  readonly date?: string | null;
  readonly sub?: string | null;
  readonly ethnicity?: string | null;
  readonly name?: string | null;
  readonly key?: string | null;
  readonly telephone?: string | null;
  readonly whatsapp?: string | null;
  readonly callingCode?: string | null;
  readonly countryCode?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly dob?: string | null;
  readonly state?: string | null;
  readonly country?: string | null;
  readonly email?: string | null;
  readonly date?: string | null;
  readonly sub?: string | null;
  readonly ethnicity?: string | null;
  readonly name?: string | null;
  readonly key?: string | null;
  readonly telephone?: string | null;
  readonly whatsapp?: string | null;
  readonly callingCode?: string | null;
  readonly countryCode?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerHost = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Host, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub?: string | null;
  readonly email?: string | null;
  readonly dob?: string | null;
  readonly country?: string | null;
  readonly state?: string | null;
  readonly date?: string | null;
  readonly ethnicity?: string | null;
  readonly language?: string | null;
  readonly name?: string | null;
  readonly secondLanguage?: string | null;
  readonly key?: string | null;
  readonly telephone?: string | null;
  readonly whatsapp?: string | null;
  readonly callingCode?: string | null;
  readonly countryCode?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyHost = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Host, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub?: string | null;
  readonly email?: string | null;
  readonly dob?: string | null;
  readonly country?: string | null;
  readonly state?: string | null;
  readonly date?: string | null;
  readonly ethnicity?: string | null;
  readonly language?: string | null;
  readonly name?: string | null;
  readonly secondLanguage?: string | null;
  readonly key?: string | null;
  readonly telephone?: string | null;
  readonly whatsapp?: string | null;
  readonly callingCode?: string | null;
  readonly countryCode?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Host = LazyLoading extends LazyLoadingDisabled ? EagerHost : LazyHost

export declare const Host: (new (init: ModelInit<Host>) => Host) & {
  copyOf(source: Host, mutator: (draft: MutableModel<Host>) => MutableModel<Host> | void): Host;
}