"use client";

export type RepairStatus =
  | "Submitted"
  | "Pending Approval"
  | "Approved"
  | "Deposit Requested"
  | "Deposit Paid"
  | "Pickup Booked"
  | "On Route to Customer"
  | "Device Picked Up"
  | "Device Received"
  | "Repairing"
  | "Fixed - Return Scheduled"
  | "Out for Delivery"
  | "Delivered - Balance Due"
  | "Paid and Collected"
  | "Awaiting Payment"
  | "In Progress"
  | "Ready"
  | "Completed"
  | "Cancelled";

export type Booking = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  device: string;
  issue: string;
  preferredDate: string;
  preferredTime: string;
  serviceType?: "Workshop booking" | "Door-to-door pickup" | "Onsite mobile repair" | "Pickup and return";
  address?: string;
  suburb?: string;
  postcode?: string;
  accessNotes?: string;
  deviceClues?: string;
  photoNames?: string[];
  depositAmount?: string;
  balanceAmount?: string;
  paymentStatus?: "No payment requested" | "Deposit requested" | "Deposit paid" | "Balance requested" | "Fully paid";
  paymentLink?: string;
  notificationStatus?: "Not sent" | "Website updated" | "Email queued" | "SMTP not configured";
  lastNotifiedAt?: string;
  pickupEta?: string;
  returnEta?: string;
  customerNotification?: string;
  status: RepairStatus;
  quotedPrice?: string;
  adminNotes?: string;
  createdAt: string;
};

export type QuoteRequest = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address?: string;
  device: string;
  deviceBrand?: string;
  deviceModel?: string;
  imei?: string;
  serialNumber?: string;
  repairNeeded: string;
  issueDetails: string;
  quoteType?: "Repair quote" | "Insurance quote";
  accidentDescription?: string;
  photoNames?: string[];
  assessmentNotes?: string;
  repairItems?: string;
  quoteFee?: string;
  quotePaymentStatus?: "Not requested" | "Payment requested" | "Payment submitted" | "Paid";
  paymentLink?: string;
  invoiceStatus?: "Not sent" | "Website updated" | "Email queued" | "SMTP not configured";
  invoiceNumber?: string;
  invoiceIssuedAt?: string;
  paymentSubmittedAt?: string;
  paymentConfirmedAt?: string;
  pdfReleasedAt?: string;
  customerNotification?: string;
  quoteValidUntil?: string;
  status: RepairStatus;
  quotedPrice?: string;
  adminNotes?: string;
  createdAt: string;
};

export type CustomerQuery = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  device: string;
  issue: string;
  visibleInfo: string;
  status: "New" | "Reviewed" | "Replied";
  emailStatus: "Queued" | "SMTP not configured";
  createdAt: string;
};

export type PriceItem = {
  id: string;
  device: string;
  repair: string;
  priceRange: string;
  time: string;
  warranty: string;
  availability: "Available" | "Order required" | "Diagnostic only" | "Diagnostic required";
};

export type StoreState = {
  bookings: Booking[];
  quotes: QuoteRequest[];
  queries: CustomerQuery[];
  prices: PriceItem[];
  users: LocalUser[];
  deletedPriceIds: string[];
  otp?: OtpChallenge;
  session?: LocalSession;
};

export type LocalUser = {
  id: string;
  email: string;
  phone: string;
  createdAt: string;
  lastLoginAt?: string;
};

export type OtpChallenge = {
  email: string;
  phone: string;
  purpose: "login" | "register";
  code: string;
  expiresAt: string;
};

export type LocalSession = {
  userId: string;
  email: string;
  phone: string;
  loggedInAt: string;
};

const storageKey = "casey-repairs-local-mvp";

const repairCatalog = [
  { repair: "Screen replacement", priceRange: "$39 - $404", time: "Same day to next day", warranty: "90 days", availability: "Available" as const },
  { repair: "Battery replacement", priceRange: "$39 - $132", time: "Same day", warranty: "90 days", availability: "Available" as const },
  { repair: "Charging port repair", priceRange: "$39 - $177", time: "Same day to 2 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "Back glass replacement", priceRange: "$39 - $177", time: "1 - 3 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "Rear camera repair", priceRange: "$39 - $223", time: "Same day to 2 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "Front camera repair", priceRange: "$39 - $132", time: "Same day to 2 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "Earpiece speaker repair", priceRange: "$39 - $132", time: "Same day", warranty: "90 days", availability: "Available" as const },
  { repair: "Loud speaker repair", priceRange: "$39 - $86", time: "Same day", warranty: "90 days", availability: "Available" as const },
  { repair: "Microphone repair", priceRange: "$39 - $177", time: "Same day to 2 days", warranty: "90 days", availability: "Available" as const },
  { repair: "Volume button repair", priceRange: "$39 - $132", time: "Same day to 2 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "Power button repair", priceRange: "$39 - $132", time: "Same day to 2 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "Fingerprint repair", priceRange: "$79 - $189", time: "1 - 3 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "Camera glass replacement", priceRange: "$41", time: "Same day", warranty: "90 days", availability: "Available" as const },
  { repair: "Housing replacement", priceRange: "$177 - $314", time: "2 - 5 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "Software repair", priceRange: "$39 - $41", time: "Same day", warranty: "30 days", availability: "Available" as const }
];

const diagnosticCatalog = [
  { device: "All supported phones", repair: "Motherboard diagnostic", priceRange: "From $39 inspection", time: "2 - 5 days", warranty: "Case by case", availability: "Diagnostic required" as const },
  { device: "All supported phones", repair: "Face ID / biometric diagnostic", priceRange: "From $39 inspection", time: "2 - 5 days", warranty: "Case by case", availability: "Diagnostic required" as const },
  { device: "All supported phones", repair: "Charging IC diagnostic", priceRange: "From $39 inspection", time: "2 - 5 days", warranty: "Case by case", availability: "Diagnostic required" as const },
  { device: "All supported phones", repair: "No power diagnostic", priceRange: "From $39 inspection", time: "2 - 5 days", warranty: "Case by case", availability: "Diagnostic required" as const },
  { device: "All supported phones", repair: "Water damage inspection", priceRange: "From $39 inspection", time: "2 - 5 days", warranty: "Case by case", availability: "Diagnostic required" as const },
  { device: "All supported phones", repair: "Data recovery assessment", priceRange: "From $39 assessment", time: "2 - 7 days", warranty: "Case by case", availability: "Diagnostic required" as const },
  { device: "All supported phones", repair: "Network fault diagnostic", priceRange: "From $39 inspection", time: "2 - 5 days", warranty: "Case by case", availability: "Diagnostic required" as const }
];

const benchmarkRepairRanges = new Map(repairCatalog.map((item) => [item.repair, item.priceRange]));

const laptopRepairCatalog = [
  { repair: "Screen replacement", priceRange: "$149 - $399", time: "1 - 3 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "Battery replacement", priceRange: "$119 - $289", time: "Same day to 2 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "Keyboard replacement", priceRange: "$129 - $279", time: "1 - 3 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "Charging port repair", priceRange: "$99 - $249", time: "1 - 3 days", warranty: "90 days", availability: "Order required" as const },
  { repair: "SSD upgrade", priceRange: "$99 - $249", time: "Same day to 2 days", warranty: "90 days", availability: "Available" as const },
  { repair: "Software repair", priceRange: "$59 - $149", time: "Same day", warranty: "30 days", availability: "Available" as const },
  { repair: "Data recovery assessment", priceRange: "From $39 assessment", time: "2 - 7 days", warranty: "Case by case", availability: "Diagnostic required" as const },
  { repair: "Liquid damage diagnostic", priceRange: "From $39 inspection", time: "2 - 5 days", warranty: "Case by case", availability: "Diagnostic required" as const },
  { repair: "No power diagnostic", priceRange: "From $39 inspection", time: "2 - 5 days", warranty: "Case by case", availability: "Diagnostic required" as const }
];

const laptopCatalog = [
  "Apple MacBook Air",
  "Apple MacBook Pro",
  "Windows laptop",
  "Dell laptop",
  "HP laptop",
  "Lenovo laptop",
  "Acer laptop",
  "Asus laptop",
  "Microsoft Surface",
  "Gaming laptop"
];

const deviceCatalog = [
  ...Array.from({ length: 13 }, (_, index) => `iPhone ${index + 4}`),
  "iPhone SE 1st Gen",
  "iPhone SE 2nd Gen",
  "iPhone SE 3rd Gen",
  "iPhone X",
  "iPhone XR",
  "iPhone XS",
  "iPhone XS Max",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12 Mini",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13 Mini",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14 Plus",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 16 Plus",
  "iPhone 16 Pro",
  "iPhone 16 Pro Max",
  "Samsung Galaxy S8",
  "Samsung Galaxy S8 Plus",
  "Samsung Galaxy S9",
  "Samsung Galaxy S9 Plus",
  "Samsung Galaxy S10",
  "Samsung Galaxy S10 Plus",
  ...Array.from({ length: 7 }, (_, index) => {
    const generation = index + 20;
    return [`Samsung Galaxy S${generation}`, `Samsung Galaxy S${generation} Plus`, `Samsung Galaxy S${generation} Ultra`];
  }).flat(),
  "Samsung Galaxy S8 Edge",
  "Samsung Galaxy S10e",
  "Samsung Galaxy Note 20",
  "Samsung Galaxy Note 20 Ultra",
  "Samsung Galaxy A12",
  "Samsung Galaxy A13",
  "Samsung Galaxy A14",
  "Samsung Galaxy A15",
  "Samsung Galaxy A22",
  "Samsung Galaxy A23",
  "Samsung Galaxy A24",
  "Samsung Galaxy A25",
  "Samsung Galaxy A32",
  "Samsung Galaxy A33",
  "Samsung Galaxy A34",
  "Samsung Galaxy A35",
  "Samsung Galaxy A52",
  "Samsung Galaxy A53",
  "Samsung Galaxy A54",
  "Samsung Galaxy A55",
  "Samsung Galaxy Z Flip",
  "Samsung Galaxy Z Flip 3",
  "Samsung Galaxy Z Flip 4",
  "Samsung Galaxy Z Flip 5",
  "Samsung Galaxy Z Flip 6",
  "Samsung Galaxy Z Fold 2",
  "Samsung Galaxy Z Fold 3",
  "Samsung Galaxy Z Fold 4",
  "Samsung Galaxy Z Fold 5",
  "Samsung Galaxy Z Fold 6",
  "Google Pixel 6",
  "Google Pixel 6 Pro",
  "Google Pixel 7",
  "Google Pixel 7 Pro",
  "Google Pixel 8",
  "Google Pixel 8 Pro",
  "Google Pixel 9",
  "Google Pixel 9 Pro",
  "Oppo A54",
  "Oppo A57",
  "Oppo A74",
  "Oppo A78",
  "Oppo Reno 6",
  "Oppo Reno 7",
  "Oppo Reno 8",
  "Oppo Reno 10",
  "Oppo Find X3",
  "Oppo Find X5",
  "Oppo Find X6",
  "Vivo Y20",
  "Vivo Y21",
  "Vivo Y33s",
  "Vivo Y52",
  "Vivo V21",
  "Vivo V23",
  "Vivo V25",
  "Vivo X60",
  "Vivo X80",
  "Realme C21",
  "Realme C35",
  "Realme 7",
  "Realme 8",
  "Realme 9",
  "Realme 10",
  "Realme GT",
  "Xiaomi Mi 10",
  "Xiaomi Mi 11",
  "Xiaomi 12",
  "Xiaomi 13",
  "Xiaomi 14",
  "Redmi Note 9",
  "Redmi Note 10",
  "Redmi Note 11",
  "Redmi Note 12",
  "Redmi Note 13",
  "POCO X3",
  "POCO X4",
  "POCO X5",
  "POCO F3",
  "POCO F4",
  "OnePlus 7",
  "OnePlus 8",
  "OnePlus 9",
  "OnePlus 10",
  "OnePlus 11",
  "OnePlus 12",
  "Motorola G Power",
  "Motorola G Stylus",
  "Motorola Edge 30",
  "Motorola Edge 40",
  "Huawei P30",
  "Huawei P40",
  "Huawei Mate 20",
  "Huawei Mate 40",
  "Nokia G20",
  "Nokia G50",
  "Sony Xperia 1",
  "Sony Xperia 5",
  "Nothing Phone 1",
  "Nothing Phone 2",
  "Asus ROG Phone 5",
  "Asus ROG Phone 6",
  "Asus ROG Phone 7",
  "Generic Android - budget model",
  "Generic Android - midrange model",
  "Generic Android - flagship model"
];

function buildSeedPrices(): PriceItem[] {
  const devicePrices = deviceCatalog.flatMap((device, deviceIndex) =>
    repairCatalog.map((repair, repairIndex) => ({
      id: `PRICE-${String(deviceIndex + 1).padStart(3, "0")}-${String(repairIndex + 1).padStart(2, "0")}`,
      device,
      ...repair
    }))
  );
  const laptopPrices = laptopCatalog.flatMap((device, deviceIndex) =>
    laptopRepairCatalog.map((repair, repairIndex) => ({
      id: `PRICE-LAP-${String(deviceIndex + 1).padStart(2, "0")}-${String(repairIndex + 1).padStart(2, "0")}`,
      device,
      ...repair
    }))
  );
  const diagnostics = diagnosticCatalog.map((price, index) => ({
    id: `PRICE-DIAG-${String(index + 1).padStart(2, "0")}`,
    ...price
  }));
  return [...diagnostics, ...laptopPrices, ...devicePrices];
}

const seedPrices = buildSeedPrices();

const starterState: StoreState = {
  bookings: [],
  quotes: [],
  queries: [],
  users: [],
  deletedPriceIds: [],
  prices: seedPrices
};

function readState(): StoreState {
  if (typeof window === "undefined") {
    return starterState;
  }

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) {
    writeState(starterState);
    return starterState;
  }

  try {
    return normaliseState(JSON.parse(saved) as Partial<StoreState>);
  } catch {
    writeState(starterState);
    return starterState;
  }
}

function normaliseState(state: Partial<StoreState>): StoreState {
  const cleanedPrices = (state.prices || [])
    .filter((price) => !["PRICE-001", "PRICE-002", "PRICE-003"].includes(price.id))
    .filter((price) => !(isDeviceSeedPriceId(price.id) && (price.availability.includes("Diagnostic") || price.priceRange.toLowerCase().includes("quote after"))))
    .filter((price) => !(isDeviceSeedPriceId(price.id) && price.repair.toLowerCase().includes("motherboard inspection")))
    .map((price) => ({
      ...price,
      availability: price.availability === "Diagnostic only" ? "Diagnostic required" : price.availability,
      priceRange:
        isDeviceSeedPriceId(price.id) && benchmarkRepairRanges.has(price.repair)
          ? benchmarkRepairRanges.get(price.repair) || price.priceRange
          :
        price.priceRange.toLowerCase().includes("quote after")
          ? "From $39 inspection"
          : price.priceRange.replace("$49", "$39")
    }));
  const nextState: StoreState = {
    bookings: state.bookings || [],
    quotes: state.quotes || [],
    queries: state.queries || [],
    prices: mergeSeedPrices(cleanedPrices, state.deletedPriceIds || []),
    users: (state.users || []).map((user) => ({ ...user, phone: user.phone || "" })),
    deletedPriceIds: state.deletedPriceIds || [],
    otp: state.otp,
    session: state.session
  };

  if (!state.users || !state.bookings || !state.quotes || !state.prices) {
    writeState(nextState);
  }

  return nextState;
}

function mergeSeedPrices(existingPrices: PriceItem[], deletedPriceIds: string[]) {
  const byId = new Map(existingPrices.map((price) => [price.id, price]));
  seedPrices.forEach((price) => {
    if (deletedPriceIds.includes(price.id)) {
      return;
    }
    const existing = byId.get(price.id);
    byId.set(price.id, existing || price);
  });
  return Array.from(byId.values());
}

function isSeedPriceId(id: string) {
  return /^PRICE-\d{3}-\d{2}$/.test(id) || /^PRICE-DIAG-\d{2}$/.test(id);
}

function isDeviceSeedPriceId(id: string) {
  return /^PRICE-\d{3}-\d{2}$/.test(id);
}

function writeState(state: StoreState) {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
  window.dispatchEvent(new Event("casey-store-updated"));
}

export function getStore() {
  return readState();
}

export function subscribeStore(callback: () => void) {
  window.addEventListener("casey-store-updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("casey-store-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

export function createBooking(input: Omit<Booking, "id" | "status" | "createdAt">) {
  const state = readState();
  const booking: Booking = {
    ...input,
    id: `CPTR-${String(Date.now()).slice(-6)}`,
    status: input.serviceType ? "Pending Approval" : "Submitted",
    paymentStatus: input.paymentStatus || "No payment requested",
    notificationStatus: input.notificationStatus || "Not sent",
    customerNotification:
      input.customerNotification ||
      (input.serviceType
        ? "Request received. Casey Repairs will review the job, confirm the visit and send the next step."
        : undefined),
    createdAt: new Date().toISOString()
  };

  writeState({ ...state, bookings: [booking, ...state.bookings] });
  return booking;
}

export function createQuote(input: Omit<QuoteRequest, "id" | "status" | "createdAt">) {
  const state = readState();
  const quote: QuoteRequest = {
    ...input,
    id: `QUOTE-${String(Date.now()).slice(-6)}`,
    status: "Submitted",
    createdAt: new Date().toISOString()
  };

  writeState({ ...state, quotes: [quote, ...state.quotes] });
  return quote;
}

export function createQuery(input: Omit<CustomerQuery, "id" | "status" | "emailStatus" | "createdAt">) {
  const state = readState();
  const query: CustomerQuery = {
    ...input,
    id: `QUERY-${String(Date.now()).slice(-6)}`,
    status: "New",
    emailStatus: "SMTP not configured",
    createdAt: new Date().toISOString()
  };

  writeState({ ...state, queries: [query, ...state.queries] });
  return query;
}

export function updateQuery(id: string, changes: Partial<CustomerQuery>) {
  const state = readState();
  writeState({
    ...state,
    queries: state.queries.map((query) => (query.id === id ? { ...query, ...changes } : query))
  });
}

export function updateBooking(id: string, changes: Partial<Booking>) {
  const state = readState();
  writeState({
    ...state,
    bookings: state.bookings.map((booking) =>
      booking.id === id ? { ...booking, ...changes } : booking
    )
  });
}

export function deleteBooking(id: string) {
  const state = readState();
  writeState({
    ...state,
    bookings: state.bookings.filter((booking) => booking.id !== id)
  });
}

export function updateQuote(id: string, changes: Partial<QuoteRequest>) {
  const state = readState();
  writeState({
    ...state,
    quotes: state.quotes.map((quote) => (quote.id === id ? { ...quote, ...changes } : quote))
  });
}

export function upsertPrice(input: Omit<PriceItem, "id"> & { id?: string }) {
  const state = readState();
  const price: PriceItem = {
    ...input,
    id: input.id || `PRICE-${String(Date.now()).slice(-6)}`
  };
  const exists = state.prices.some((item) => item.id === price.id);

  writeState({
    ...state,
    deletedPriceIds: state.deletedPriceIds.filter((id) => id !== price.id),
    prices: exists
      ? state.prices.map((item) => (item.id === price.id ? price : item))
      : [price, ...state.prices]
  });
}

export function deletePrice(id: string) {
  const state = readState();
  writeState({
    ...state,
    deletedPriceIds: Array.from(new Set([...state.deletedPriceIds, id])),
    prices: state.prices.filter((item) => item.id !== id)
  });
}

export function findRepair(reference: string) {
  const state = readState();
  const normalised = reference.trim().toUpperCase();
  return (
    state.bookings.find((booking) => booking.id.toUpperCase() === normalised) ||
    state.quotes.find((quote) => quote.id.toUpperCase() === normalised)
  );
}

export function isValidEmail(emailInput: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim().toLowerCase());
}

export function isValidPhone(phoneInput: string) {
  const compact = phoneInput.replace(/[\s()-]/g, "");
  return /^04\d{8}$/.test(compact) || /^\+614\d{8}$/.test(compact) || /^614\d{8}$/.test(compact);
}

export function findUserByEmail(emailInput: string) {
  const email = emailInput.trim().toLowerCase();
  return readState().users.find((user) => user.email === email);
}

export function requestOtp(emailInput: string, phoneInput: string, purpose: "login" | "register") {
  const email = emailInput.trim().toLowerCase();
  const phone = phoneInput.trim();
  const state = readState();
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const otp: OtpChallenge = {
    email,
    phone,
    purpose,
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
  };

  writeState({ ...state, otp });
  return otp;
}

export function verifyOtp(emailInput: string, codeInput: string) {
  const email = emailInput.trim().toLowerCase();
  const code = codeInput.trim();
  const state = readState();

  if (!state.otp || state.otp.email !== email || state.otp.code !== code) {
    return { ok: false, message: "OTP does not match." };
  }

  if (new Date(state.otp.expiresAt).getTime() < Date.now()) {
    return { ok: false, message: "OTP has expired. Request a new one." };
  }

  const existingUser = state.users.find((user) => user.email === email);
  if (state.otp.purpose === "login" && !existingUser) {
    return { ok: false, message: "This email is not registered. Please register first." };
  }
  if (state.otp.purpose === "register" && existingUser) {
    return { ok: false, message: "This email is already registered. Please login instead." };
  }
  const user: LocalUser =
    existingUser || {
      id: `USER-${String(Date.now()).slice(-6)}`,
      email,
      phone: state.otp.phone,
      createdAt: new Date().toISOString()
    };

  const session: LocalSession = {
    userId: user.id,
    email: user.email,
    phone: state.otp.phone || user.phone,
    loggedInAt: new Date().toISOString()
  };

  writeState({
    ...state,
    users: existingUser
      ? state.users.map((item) =>
          item.id === existingUser.id
            ? { ...item, phone: session.phone || item.phone, lastLoginAt: session.loggedInAt }
            : item
        )
      : [{ ...user, lastLoginAt: session.loggedInAt }, ...state.users],
    otp: undefined,
    session
  });

  return { ok: true, message: "Logged in.", session };
}

export function getSession() {
  return readState().session;
}

export function logout() {
  const state = readState();
  writeState({ ...state, session: undefined });
}
