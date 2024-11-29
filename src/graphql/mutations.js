/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTotalViews = /* GraphQL */ `
  mutation CreateTotalViews(
    $input: CreateTotalViewsInput!
    $condition: ModelTotalViewsConditionInput
  ) {
    createTotalViews(input: $input, condition: $condition) {
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
export const updateTotalViews = /* GraphQL */ `
  mutation UpdateTotalViews(
    $input: UpdateTotalViewsInput!
    $condition: ModelTotalViewsConditionInput
  ) {
    updateTotalViews(input: $input, condition: $condition) {
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
export const deleteTotalViews = /* GraphQL */ `
  mutation DeleteTotalViews(
    $input: DeleteTotalViewsInput!
    $condition: ModelTotalViewsConditionInput
  ) {
    deleteTotalViews(input: $input, condition: $condition) {
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
export const createUniqueViews = /* GraphQL */ `
  mutation CreateUniqueViews(
    $input: CreateUniqueViewsInput!
    $condition: ModelUniqueViewsConditionInput
  ) {
    createUniqueViews(input: $input, condition: $condition) {
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
export const updateUniqueViews = /* GraphQL */ `
  mutation UpdateUniqueViews(
    $input: UpdateUniqueViewsInput!
    $condition: ModelUniqueViewsConditionInput
  ) {
    updateUniqueViews(input: $input, condition: $condition) {
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
export const deleteUniqueViews = /* GraphQL */ `
  mutation DeleteUniqueViews(
    $input: DeleteUniqueViewsInput!
    $condition: ModelUniqueViewsConditionInput
  ) {
    deleteUniqueViews(input: $input, condition: $condition) {
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
export const createObservePayment = /* GraphQL */ `
  mutation CreateObservePayment(
    $input: CreateObservePaymentInput!
    $condition: ModelObservePaymentConditionInput
  ) {
    createObservePayment(input: $input, condition: $condition) {
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
export const updateObservePayment = /* GraphQL */ `
  mutation UpdateObservePayment(
    $input: UpdateObservePaymentInput!
    $condition: ModelObservePaymentConditionInput
  ) {
    updateObservePayment(input: $input, condition: $condition) {
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
export const deleteObservePayment = /* GraphQL */ `
  mutation DeleteObservePayment(
    $input: DeleteObservePaymentInput!
    $condition: ModelObservePaymentConditionInput
  ) {
    deleteObservePayment(input: $input, condition: $condition) {
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
export const createApartment = /* GraphQL */ `
  mutation CreateApartment(
    $input: CreateApartmentInput!
    $condition: ModelApartmentConditionInput
  ) {
    createApartment(input: $input, condition: $condition) {
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
export const updateApartment = /* GraphQL */ `
  mutation UpdateApartment(
    $input: UpdateApartmentInput!
    $condition: ModelApartmentConditionInput
  ) {
    updateApartment(input: $input, condition: $condition) {
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
export const deleteApartment = /* GraphQL */ `
  mutation DeleteApartment(
    $input: DeleteApartmentInput!
    $condition: ModelApartmentConditionInput
  ) {
    deleteApartment(input: $input, condition: $condition) {
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
export const createObserveHostPayment = /* GraphQL */ `
  mutation CreateObserveHostPayment(
    $input: CreateObserveHostPaymentInput!
    $condition: ModelObserveHostPaymentConditionInput
  ) {
    createObserveHostPayment(input: $input, condition: $condition) {
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
export const updateObserveHostPayment = /* GraphQL */ `
  mutation UpdateObserveHostPayment(
    $input: UpdateObserveHostPaymentInput!
    $condition: ModelObserveHostPaymentConditionInput
  ) {
    updateObserveHostPayment(input: $input, condition: $condition) {
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
export const deleteObserveHostPayment = /* GraphQL */ `
  mutation DeleteObserveHostPayment(
    $input: DeleteObserveHostPaymentInput!
    $condition: ModelObserveHostPaymentConditionInput
  ) {
    deleteObserveHostPayment(input: $input, condition: $condition) {
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
export const createAllReviews = /* GraphQL */ `
  mutation CreateAllReviews(
    $input: CreateAllReviewsInput!
    $condition: ModelAllReviewsConditionInput
  ) {
    createAllReviews(input: $input, condition: $condition) {
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
export const updateAllReviews = /* GraphQL */ `
  mutation UpdateAllReviews(
    $input: UpdateAllReviewsInput!
    $condition: ModelAllReviewsConditionInput
  ) {
    updateAllReviews(input: $input, condition: $condition) {
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
export const deleteAllReviews = /* GraphQL */ `
  mutation DeleteAllReviews(
    $input: DeleteAllReviewsInput!
    $condition: ModelAllReviewsConditionInput
  ) {
    deleteAllReviews(input: $input, condition: $condition) {
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
export const createPaymentHistory = /* GraphQL */ `
  mutation CreatePaymentHistory(
    $input: CreatePaymentHistoryInput!
    $condition: ModelPaymentHistoryConditionInput
  ) {
    createPaymentHistory(input: $input, condition: $condition) {
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
export const updatePaymentHistory = /* GraphQL */ `
  mutation UpdatePaymentHistory(
    $input: UpdatePaymentHistoryInput!
    $condition: ModelPaymentHistoryConditionInput
  ) {
    updatePaymentHistory(input: $input, condition: $condition) {
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
export const deletePaymentHistory = /* GraphQL */ `
  mutation DeletePaymentHistory(
    $input: DeletePaymentHistoryInput!
    $condition: ModelPaymentHistoryConditionInput
  ) {
    deletePaymentHistory(input: $input, condition: $condition) {
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
export const createCardDetails = /* GraphQL */ `
  mutation CreateCardDetails(
    $input: CreateCardDetailsInput!
    $condition: ModelCardDetailsConditionInput
  ) {
    createCardDetails(input: $input, condition: $condition) {
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
export const updateCardDetails = /* GraphQL */ `
  mutation UpdateCardDetails(
    $input: UpdateCardDetailsInput!
    $condition: ModelCardDetailsConditionInput
  ) {
    updateCardDetails(input: $input, condition: $condition) {
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
export const deleteCardDetails = /* GraphQL */ `
  mutation DeleteCardDetails(
    $input: DeleteCardDetailsInput!
    $condition: ModelCardDetailsConditionInput
  ) {
    deleteCardDetails(input: $input, condition: $condition) {
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
export const createHostAccount = /* GraphQL */ `
  mutation CreateHostAccount(
    $input: CreateHostAccountInput!
    $condition: ModelHostAccountConditionInput
  ) {
    createHostAccount(input: $input, condition: $condition) {
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
export const updateHostAccount = /* GraphQL */ `
  mutation UpdateHostAccount(
    $input: UpdateHostAccountInput!
    $condition: ModelHostAccountConditionInput
  ) {
    updateHostAccount(input: $input, condition: $condition) {
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
export const deleteHostAccount = /* GraphQL */ `
  mutation DeleteHostAccount(
    $input: DeleteHostAccountInput!
    $condition: ModelHostAccountConditionInput
  ) {
    deleteHostAccount(input: $input, condition: $condition) {
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
export const createUserAuth = /* GraphQL */ `
  mutation CreateUserAuth(
    $input: CreateUserAuthInput!
    $condition: ModelUserAuthConditionInput
  ) {
    createUserAuth(input: $input, condition: $condition) {
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
export const updateUserAuth = /* GraphQL */ `
  mutation UpdateUserAuth(
    $input: UpdateUserAuthInput!
    $condition: ModelUserAuthConditionInput
  ) {
    updateUserAuth(input: $input, condition: $condition) {
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
export const deleteUserAuth = /* GraphQL */ `
  mutation DeleteUserAuth(
    $input: DeleteUserAuthInput!
    $condition: ModelUserAuthConditionInput
  ) {
    deleteUserAuth(input: $input, condition: $condition) {
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
export const createWishList = /* GraphQL */ `
  mutation CreateWishList(
    $input: CreateWishListInput!
    $condition: ModelWishListConditionInput
  ) {
    createWishList(input: $input, condition: $condition) {
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
export const updateWishList = /* GraphQL */ `
  mutation UpdateWishList(
    $input: UpdateWishListInput!
    $condition: ModelWishListConditionInput
  ) {
    updateWishList(input: $input, condition: $condition) {
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
export const deleteWishList = /* GraphQL */ `
  mutation DeleteWishList(
    $input: DeleteWishListInput!
    $condition: ModelWishListConditionInput
  ) {
    deleteWishList(input: $input, condition: $condition) {
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
export const createReview = /* GraphQL */ `
  mutation CreateReview(
    $input: CreateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    createReview(input: $input, condition: $condition) {
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
export const updateReview = /* GraphQL */ `
  mutation UpdateReview(
    $input: UpdateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    updateReview(input: $input, condition: $condition) {
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
export const deleteReview = /* GraphQL */ `
  mutation DeleteReview(
    $input: DeleteReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    deleteReview(input: $input, condition: $condition) {
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
export const createPayment = /* GraphQL */ `
  mutation CreatePayment(
    $input: CreatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    createPayment(input: $input, condition: $condition) {
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
export const updatePayment = /* GraphQL */ `
  mutation UpdatePayment(
    $input: UpdatePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    updatePayment(input: $input, condition: $condition) {
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
export const deletePayment = /* GraphQL */ `
  mutation DeletePayment(
    $input: DeletePaymentInput!
    $condition: ModelPaymentConditionInput
  ) {
    deletePayment(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createHost = /* GraphQL */ `
  mutation CreateHost(
    $input: CreateHostInput!
    $condition: ModelHostConditionInput
  ) {
    createHost(input: $input, condition: $condition) {
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
export const updateHost = /* GraphQL */ `
  mutation UpdateHost(
    $input: UpdateHostInput!
    $condition: ModelHostConditionInput
  ) {
    updateHost(input: $input, condition: $condition) {
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
export const deleteHost = /* GraphQL */ `
  mutation DeleteHost(
    $input: DeleteHostInput!
    $condition: ModelHostConditionInput
  ) {
    deleteHost(input: $input, condition: $condition) {
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
