/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTotalViews = /* GraphQL */ `
  query GetTotalViews($id: ID!) {
    getTotalViews(id: $id) {
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
export const listTotalViews = /* GraphQL */ `
  query ListTotalViews(
    $filter: ModelTotalViewsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTotalViews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncTotalViews = /* GraphQL */ `
  query SyncTotalViews(
    $filter: ModelTotalViewsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncTotalViews(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getUniqueViews = /* GraphQL */ `
  query GetUniqueViews($id: ID!) {
    getUniqueViews(id: $id) {
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
export const listUniqueViews = /* GraphQL */ `
  query ListUniqueViews(
    $filter: ModelUniqueViewsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUniqueViews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncUniqueViews = /* GraphQL */ `
  query SyncUniqueViews(
    $filter: ModelUniqueViewsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUniqueViews(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getObservePayment = /* GraphQL */ `
  query GetObservePayment($id: ID!) {
    getObservePayment(id: $id) {
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
export const listObservePayments = /* GraphQL */ `
  query ListObservePayments(
    $filter: ModelObservePaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listObservePayments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncObservePayments = /* GraphQL */ `
  query SyncObservePayments(
    $filter: ModelObservePaymentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncObservePayments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getApartment = /* GraphQL */ `
  query GetApartment($id: ID!) {
    getApartment(id: $id) {
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
export const listApartments = /* GraphQL */ `
  query ListApartments(
    $filter: ModelApartmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listApartments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncApartments = /* GraphQL */ `
  query SyncApartments(
    $filter: ModelApartmentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncApartments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getObserveHostPayment = /* GraphQL */ `
  query GetObserveHostPayment($id: ID!) {
    getObserveHostPayment(id: $id) {
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
export const listObserveHostPayments = /* GraphQL */ `
  query ListObserveHostPayments(
    $filter: ModelObserveHostPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listObserveHostPayments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncObserveHostPayments = /* GraphQL */ `
  query SyncObserveHostPayments(
    $filter: ModelObserveHostPaymentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncObserveHostPayments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getAllReviews = /* GraphQL */ `
  query GetAllReviews($id: ID!) {
    getAllReviews(id: $id) {
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
export const listAllReviews = /* GraphQL */ `
  query ListAllReviews(
    $filter: ModelAllReviewsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAllReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncAllReviews = /* GraphQL */ `
  query SyncAllReviews(
    $filter: ModelAllReviewsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncAllReviews(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getPaymentHistory = /* GraphQL */ `
  query GetPaymentHistory($id: ID!) {
    getPaymentHistory(id: $id) {
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
export const listPaymentHistories = /* GraphQL */ `
  query ListPaymentHistories(
    $filter: ModelPaymentHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPaymentHistories(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncPaymentHistories = /* GraphQL */ `
  query SyncPaymentHistories(
    $filter: ModelPaymentHistoryFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPaymentHistories(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getCardDetails = /* GraphQL */ `
  query GetCardDetails($id: ID!) {
    getCardDetails(id: $id) {
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
export const listCardDetails = /* GraphQL */ `
  query ListCardDetails(
    $filter: ModelCardDetailsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCardDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncCardDetails = /* GraphQL */ `
  query SyncCardDetails(
    $filter: ModelCardDetailsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCardDetails(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getHostAccount = /* GraphQL */ `
  query GetHostAccount($id: ID!) {
    getHostAccount(id: $id) {
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
export const listHostAccounts = /* GraphQL */ `
  query ListHostAccounts(
    $filter: ModelHostAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHostAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncHostAccounts = /* GraphQL */ `
  query SyncHostAccounts(
    $filter: ModelHostAccountFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncHostAccounts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getUserAuth = /* GraphQL */ `
  query GetUserAuth($id: ID!) {
    getUserAuth(id: $id) {
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
export const listUserAuths = /* GraphQL */ `
  query ListUserAuths(
    $filter: ModelUserAuthFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserAuths(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncUserAuths = /* GraphQL */ `
  query SyncUserAuths(
    $filter: ModelUserAuthFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUserAuths(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getWishList = /* GraphQL */ `
  query GetWishList($id: ID!) {
    getWishList(id: $id) {
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
export const listWishLists = /* GraphQL */ `
  query ListWishLists(
    $filter: ModelWishListFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWishLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncWishLists = /* GraphQL */ `
  query SyncWishLists(
    $filter: ModelWishListFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncWishLists(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getReview = /* GraphQL */ `
  query GetReview($id: ID!) {
    getReview(id: $id) {
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
export const listReviews = /* GraphQL */ `
  query ListReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncReviews = /* GraphQL */ `
  query SyncReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncReviews(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getPayment = /* GraphQL */ `
  query GetPayment($id: ID!) {
    getPayment(id: $id) {
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
export const listPayments = /* GraphQL */ `
  query ListPayments(
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPayments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncPayments = /* GraphQL */ `
  query SyncPayments(
    $filter: ModelPaymentFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPayments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getHost = /* GraphQL */ `
  query GetHost($id: ID!) {
    getHost(id: $id) {
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
export const listHosts = /* GraphQL */ `
  query ListHosts(
    $filter: ModelHostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncHosts = /* GraphQL */ `
  query SyncHosts(
    $filter: ModelHostFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncHosts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
