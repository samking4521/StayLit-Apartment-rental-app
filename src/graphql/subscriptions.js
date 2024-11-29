/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTotalViews = /* GraphQL */ `
  subscription OnCreateTotalViews(
    $filter: ModelSubscriptionTotalViewsFilterInput
  ) {
    onCreateTotalViews(filter: $filter) {
      id
      apartmentID
      finalViewCount
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateTotalViews = /* GraphQL */ `
  subscription OnUpdateTotalViews(
    $filter: ModelSubscriptionTotalViewsFilterInput
  ) {
    onUpdateTotalViews(filter: $filter) {
      id
      apartmentID
      finalViewCount
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteTotalViews = /* GraphQL */ `
  subscription OnDeleteTotalViews(
    $filter: ModelSubscriptionTotalViewsFilterInput
  ) {
    onDeleteTotalViews(filter: $filter) {
      id
      apartmentID
      finalViewCount
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateUniqueViews = /* GraphQL */ `
  subscription OnCreateUniqueViews(
    $filter: ModelSubscriptionUniqueViewsFilterInput
  ) {
    onCreateUniqueViews(filter: $filter) {
      id
      userID
      apartmentID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateUniqueViews = /* GraphQL */ `
  subscription OnUpdateUniqueViews(
    $filter: ModelSubscriptionUniqueViewsFilterInput
  ) {
    onUpdateUniqueViews(filter: $filter) {
      id
      userID
      apartmentID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteUniqueViews = /* GraphQL */ `
  subscription OnDeleteUniqueViews(
    $filter: ModelSubscriptionUniqueViewsFilterInput
  ) {
    onDeleteUniqueViews(filter: $filter) {
      id
      userID
      apartmentID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateObservePayment = /* GraphQL */ `
  subscription OnCreateObservePayment(
    $filter: ModelSubscriptionObservePaymentFilterInput
  ) {
    onCreateObservePayment(filter: $filter) {
      id
      discount
      newPayment
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateObservePayment = /* GraphQL */ `
  subscription OnUpdateObservePayment(
    $filter: ModelSubscriptionObservePaymentFilterInput
  ) {
    onUpdateObservePayment(filter: $filter) {
      id
      discount
      newPayment
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteObservePayment = /* GraphQL */ `
  subscription OnDeleteObservePayment(
    $filter: ModelSubscriptionObservePaymentFilterInput
  ) {
    onDeleteObservePayment(filter: $filter) {
      id
      discount
      newPayment
      userID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateApartment = /* GraphQL */ `
  subscription OnCreateApartment(
    $filter: ModelSubscriptionApartmentFilterInput
  ) {
    onCreateApartment(filter: $filter) {
      id
      shareStatus
      placeType
      bedroom
      bathroom
      electricity
      water
      pop
      wardrobe
      lat
      lng
      address
      city
      state
      country
      apartmentTitle
      apartmentDesc
      price
      formattedPrice
      leaseDuration
      date
      status
      security
      key
      addressText
      hostID
      coverPhotoKey
      uniqueViewCount
      moveInCost
      parkingSpace
      moveInCostInt
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateApartment = /* GraphQL */ `
  subscription OnUpdateApartment(
    $filter: ModelSubscriptionApartmentFilterInput
  ) {
    onUpdateApartment(filter: $filter) {
      id
      shareStatus
      placeType
      bedroom
      bathroom
      electricity
      water
      pop
      wardrobe
      lat
      lng
      address
      city
      state
      country
      apartmentTitle
      apartmentDesc
      price
      formattedPrice
      leaseDuration
      date
      status
      security
      key
      addressText
      hostID
      coverPhotoKey
      uniqueViewCount
      moveInCost
      parkingSpace
      moveInCostInt
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteApartment = /* GraphQL */ `
  subscription OnDeleteApartment(
    $filter: ModelSubscriptionApartmentFilterInput
  ) {
    onDeleteApartment(filter: $filter) {
      id
      shareStatus
      placeType
      bedroom
      bathroom
      electricity
      water
      pop
      wardrobe
      lat
      lng
      address
      city
      state
      country
      apartmentTitle
      apartmentDesc
      price
      formattedPrice
      leaseDuration
      date
      status
      security
      key
      addressText
      hostID
      coverPhotoKey
      uniqueViewCount
      moveInCost
      parkingSpace
      moveInCostInt
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateObserveHostPayment = /* GraphQL */ `
  subscription OnCreateObserveHostPayment(
    $filter: ModelSubscriptionObserveHostPaymentFilterInput
  ) {
    onCreateObserveHostPayment(filter: $filter) {
      id
      newPayment
      hostID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateObserveHostPayment = /* GraphQL */ `
  subscription OnUpdateObserveHostPayment(
    $filter: ModelSubscriptionObserveHostPaymentFilterInput
  ) {
    onUpdateObserveHostPayment(filter: $filter) {
      id
      newPayment
      hostID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteObserveHostPayment = /* GraphQL */ `
  subscription OnDeleteObserveHostPayment(
    $filter: ModelSubscriptionObserveHostPaymentFilterInput
  ) {
    onDeleteObserveHostPayment(filter: $filter) {
      id
      newPayment
      hostID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateAllReviews = /* GraphQL */ `
  subscription OnCreateAllReviews(
    $filter: ModelSubscriptionAllReviewsFilterInput
  ) {
    onCreateAllReviews(filter: $filter) {
      id
      starLength
      reviewDesc
      date
      userID
      hostID
      apartmentID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateAllReviews = /* GraphQL */ `
  subscription OnUpdateAllReviews(
    $filter: ModelSubscriptionAllReviewsFilterInput
  ) {
    onUpdateAllReviews(filter: $filter) {
      id
      starLength
      reviewDesc
      date
      userID
      hostID
      apartmentID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteAllReviews = /* GraphQL */ `
  subscription OnDeleteAllReviews(
    $filter: ModelSubscriptionAllReviewsFilterInput
  ) {
    onDeleteAllReviews(filter: $filter) {
      id
      starLength
      reviewDesc
      date
      userID
      hostID
      apartmentID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreatePaymentHistory = /* GraphQL */ `
  subscription OnCreatePaymentHistory(
    $filter: ModelSubscriptionPaymentHistoryFilterInput
  ) {
    onCreatePaymentHistory(filter: $filter) {
      id
      price
      hostID
      apartmentID
      userID
      LeotServiceFee
      HostIncome
      date
      status
      type
      reference
      User
      Host
      Apartment
      Review
      TotalViews
      UniqueViews
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdatePaymentHistory = /* GraphQL */ `
  subscription OnUpdatePaymentHistory(
    $filter: ModelSubscriptionPaymentHistoryFilterInput
  ) {
    onUpdatePaymentHistory(filter: $filter) {
      id
      price
      hostID
      apartmentID
      userID
      LeotServiceFee
      HostIncome
      date
      status
      type
      reference
      User
      Host
      Apartment
      Review
      TotalViews
      UniqueViews
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeletePaymentHistory = /* GraphQL */ `
  subscription OnDeletePaymentHistory(
    $filter: ModelSubscriptionPaymentHistoryFilterInput
  ) {
    onDeletePaymentHistory(filter: $filter) {
      id
      price
      hostID
      apartmentID
      userID
      LeotServiceFee
      HostIncome
      date
      status
      type
      reference
      User
      Host
      Apartment
      Review
      TotalViews
      UniqueViews
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateCardDetails = /* GraphQL */ `
  subscription OnCreateCardDetails(
    $filter: ModelSubscriptionCardDetailsFilterInput
  ) {
    onCreateCardDetails(filter: $filter) {
      id
      cardOwnerName
      cardNumber
      cardExpiryDate
      cardCVV
      userID
      authorization
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateCardDetails = /* GraphQL */ `
  subscription OnUpdateCardDetails(
    $filter: ModelSubscriptionCardDetailsFilterInput
  ) {
    onUpdateCardDetails(filter: $filter) {
      id
      cardOwnerName
      cardNumber
      cardExpiryDate
      cardCVV
      userID
      authorization
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteCardDetails = /* GraphQL */ `
  subscription OnDeleteCardDetails(
    $filter: ModelSubscriptionCardDetailsFilterInput
  ) {
    onDeleteCardDetails(filter: $filter) {
      id
      cardOwnerName
      cardNumber
      cardExpiryDate
      cardCVV
      userID
      authorization
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateHostAccount = /* GraphQL */ `
  subscription OnCreateHostAccount(
    $filter: ModelSubscriptionHostAccountFilterInput
  ) {
    onCreateHostAccount(filter: $filter) {
      id
      accountName
      accountNo
      bankName
      hostID
      bankCode
      subaccountCode
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateHostAccount = /* GraphQL */ `
  subscription OnUpdateHostAccount(
    $filter: ModelSubscriptionHostAccountFilterInput
  ) {
    onUpdateHostAccount(filter: $filter) {
      id
      accountName
      accountNo
      bankName
      hostID
      bankCode
      subaccountCode
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteHostAccount = /* GraphQL */ `
  subscription OnDeleteHostAccount(
    $filter: ModelSubscriptionHostAccountFilterInput
  ) {
    onDeleteHostAccount(filter: $filter) {
      id
      accountName
      accountNo
      bankName
      hostID
      bankCode
      subaccountCode
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateUserAuth = /* GraphQL */ `
  subscription OnCreateUserAuth($filter: ModelSubscriptionUserAuthFilterInput) {
    onCreateUserAuth(filter: $filter) {
      id
      email
      password
      signInStatus
      sub
      userAppType
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateUserAuth = /* GraphQL */ `
  subscription OnUpdateUserAuth($filter: ModelSubscriptionUserAuthFilterInput) {
    onUpdateUserAuth(filter: $filter) {
      id
      email
      password
      signInStatus
      sub
      userAppType
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteUserAuth = /* GraphQL */ `
  subscription OnDeleteUserAuth($filter: ModelSubscriptionUserAuthFilterInput) {
    onDeleteUserAuth(filter: $filter) {
      id
      email
      password
      signInStatus
      sub
      userAppType
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateWishList = /* GraphQL */ `
  subscription OnCreateWishList($filter: ModelSubscriptionWishListFilterInput) {
    onCreateWishList(filter: $filter) {
      id
      userId
      apartmentId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateWishList = /* GraphQL */ `
  subscription OnUpdateWishList($filter: ModelSubscriptionWishListFilterInput) {
    onUpdateWishList(filter: $filter) {
      id
      userId
      apartmentId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteWishList = /* GraphQL */ `
  subscription OnDeleteWishList($filter: ModelSubscriptionWishListFilterInput) {
    onDeleteWishList(filter: $filter) {
      id
      userId
      apartmentId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview($filter: ModelSubscriptionReviewFilterInput) {
    onCreateReview(filter: $filter) {
      id
      starLength
      reviewDesc
      date
      apartmentID
      userID
      hostID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateReview = /* GraphQL */ `
  subscription OnUpdateReview($filter: ModelSubscriptionReviewFilterInput) {
    onUpdateReview(filter: $filter) {
      id
      starLength
      reviewDesc
      date
      apartmentID
      userID
      hostID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteReview = /* GraphQL */ `
  subscription OnDeleteReview($filter: ModelSubscriptionReviewFilterInput) {
    onDeleteReview(filter: $filter) {
      id
      starLength
      reviewDesc
      date
      apartmentID
      userID
      hostID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreatePayment = /* GraphQL */ `
  subscription OnCreatePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onCreatePayment(filter: $filter) {
      id
      price
      hostID
      apartmentID
      userID
      LeotServiceFee
      HostIncome
      date
      status
      type
      reference
      User
      Host
      Apartment
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdatePayment = /* GraphQL */ `
  subscription OnUpdatePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onUpdatePayment(filter: $filter) {
      id
      price
      hostID
      apartmentID
      userID
      LeotServiceFee
      HostIncome
      date
      status
      type
      reference
      User
      Host
      Apartment
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeletePayment = /* GraphQL */ `
  subscription OnDeletePayment($filter: ModelSubscriptionPaymentFilterInput) {
    onDeletePayment(filter: $filter) {
      id
      price
      hostID
      apartmentID
      userID
      LeotServiceFee
      HostIncome
      date
      status
      type
      reference
      User
      Host
      Apartment
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      dob
      state
      country
      email
      date
      sub
      ethnicity
      name
      key
      telephone
      whatsapp
      callingCode
      countryCode
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      dob
      state
      country
      email
      date
      sub
      ethnicity
      name
      key
      telephone
      whatsapp
      callingCode
      countryCode
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      dob
      state
      country
      email
      date
      sub
      ethnicity
      name
      key
      telephone
      whatsapp
      callingCode
      countryCode
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateHost = /* GraphQL */ `
  subscription OnCreateHost($filter: ModelSubscriptionHostFilterInput) {
    onCreateHost(filter: $filter) {
      id
      sub
      email
      dob
      country
      state
      date
      ethnicity
      language
      name
      secondLanguage
      key
      telephone
      whatsapp
      callingCode
      countryCode
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateHost = /* GraphQL */ `
  subscription OnUpdateHost($filter: ModelSubscriptionHostFilterInput) {
    onUpdateHost(filter: $filter) {
      id
      sub
      email
      dob
      country
      state
      date
      ethnicity
      language
      name
      secondLanguage
      key
      telephone
      whatsapp
      callingCode
      countryCode
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteHost = /* GraphQL */ `
  subscription OnDeleteHost($filter: ModelSubscriptionHostFilterInput) {
    onDeleteHost(filter: $filter) {
      id
      sub
      email
      dob
      country
      state
      date
      ethnicity
      language
      name
      secondLanguage
      key
      telephone
      whatsapp
      callingCode
      countryCode
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
