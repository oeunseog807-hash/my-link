import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "마이링크";

export default async function OgImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const name = decodeURIComponent(username);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#5B5FC7",
          backgroundImage:
            "linear-gradient(135deg, #7c3aed 0%, #5B5FC7 50%, #0ea5e9 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 36, opacity: 0.85, letterSpacing: 2 }}>
          MyLink
        </div>
        <div style={{ fontSize: 120, fontWeight: 800, marginTop: 12 }}>
          {`@${name}`}
        </div>
        <div style={{ fontSize: 32, opacity: 0.85, marginTop: 24 }}>
          my link page
        </div>
      </div>
    ),
    { ...size },
  );
}
