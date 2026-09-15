import type { Media } from '@/lib/types';

/**
 * Renders a section's media slot.
 *
 * Video wins over image when the editor supplied one — the reference's hero and
 * paper sections are clips, not stills. Below 992px the mobile variant is used
 * instead, because the reference art-directs per breakpoint rather than scaling,
 * and `<source media=...>` means the browser downloads only the one it needs.
 *
 * `image` stays required in the CMS even for video slots: it is the poster and
 * the fallback for anyone whose browser or connection never plays the clip.
 */
export default function SectionMedia({
  media,
  className = '',
  priority = false,
}: {
  media: Media | null;
  className?: string;
  priority?: boolean;
}) {
  if (!media) return null;

  const { image, mobileImage, video, mobileVideo, poster, alt } = media;

  if (video?.url) {
    return (
      <video
        className={className}
        poster={poster?.url ?? image?.url ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? 'auto' : 'metadata'}
        aria-label={alt}
      >
        {mobileVideo?.url ? (
          <source src={mobileVideo.url} media="(max-width: 991px)" type={mobileVideo.mime} />
        ) : null}
        <source src={video.url} type={video.mime} />
      </video>
    );
  }

  if (!image?.url) return null;

  return (
    <picture>
      {mobileImage?.url ? (
        <source media="(max-width: 991px)" srcSet={mobileImage.url} />
      ) : null}
      {/* A plain img: Strapi serves from a separate origin whose domain changes
          per environment, so this avoids tying deploys to a next.config image
          allowlist. */}
      <img
        src={image.url}
        alt={alt ?? image.alternativeText ?? ''}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
      />
    </picture>
  );
}
