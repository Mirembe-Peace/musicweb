import Container from "@/components/Container";
import SocialLinkCard from "@/components/SocialLinkCard";

export default function SocialPage() {
  const links = [
    { name: "Apple Music", href: "https://music.apple.com", icon: "/icons/applemusic.svg", color: "#FA233B" },
    { name: "Spotify", href: "https://spotify.com", icon: "/icons/spotify.svg", color: "#1DB954" },
    { name: "YouTube", href: "https://youtube.com", icon: "/icons/youtube.svg", color: "#FF0000" },
    { name: "SoundCloud", href: "https://soundcloud.com", icon: "/icons/soundcloud.svg", color: "#FF5500" },
    { name: "Instagram", href: "https://instagram.com", icon: "/icons/instagram.svg", color: "#E1306C" },
    { name: "TikTok", href: "https://tiktok.com", icon: "/icons/tiktok.svg", color: "#00F2EA" },
    { name: "Facebook", href: "https://facebook.com", icon: "/icons/facebook.svg", color: "#1877F2" },
    { name: "Snapchat", href: "https://snapchat.com", icon: "/icons/snapchat.svg", color: "#FFFC00" },
    { name: "WhatsApp", href: "https://wa.me/2567xxxxxx", icon: "/icons/whatsapp.svg", color: "#25D366" },
    { name: "Threads", href: "https://threads.net", icon: "/icons/threads.svg", color: "#111111" },
    { name: "X", href: "https://x.com", icon: "/icons/x.svg", color: "#111111" },
  ];

  return (
    <Container>
      <div className="max-w-md mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <img
            src="/ashaba.png"
            alt="Ashaba"
            className="w-24 h-24 mx-auto rounded-full object-cover mb-4 ring-2 ring-zinc-200 dark:ring-zinc-800"
          />

            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Ashaba
            </h1>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Music • Culture • Expression
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link) => (
            <SocialLinkCard key={link.name} {...link} />
          ))}
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} AshabaMusic
        </p>
      </div>
    </Container>
  );
}