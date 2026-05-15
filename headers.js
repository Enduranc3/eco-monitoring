/**
 * Цей файл конфігурує кешування headers для Next.js додатку
 */
export const headers = async () => {
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ];
};
