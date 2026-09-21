export const STORE_CONFIG = {
  name: process.env.NEXT_PUBLIC_STORE_NAME ?? "My Phone Store",
  logo: process.env.NEXT_PUBLIC_STORE_LOGO ?? "/logo.jpg",
  placeId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ?? "ChIJ_placeholder",
  privateFeedbackUrl: process.env.NEXT_PUBLIC_PRIVATE_FEEDBACK_URL ?? "https://forms.google.com",
  googleReviewUrl: () =>
    `https://search.google.com/local/writereview?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ?? "ChIJ_placeholder"}`,
};
