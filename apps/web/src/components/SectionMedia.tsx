import type { Media } from '@/lib/types';

/**
 * Renders a section's media slot.
 *
 * The reference art-directs per breakpoint rather than scaling, so a mobile
 * crop — when the editor supplied one — is swapped in below 992px via <picture>
 * rather than CSS, so the browser only downloads the one it uses.
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
  if (!media?.image?.url) return null;

  const { image, mobileImage, alt } = media;

  return (
    <picture>
      {mobileImage?.url ? (
        <source media="(max-width: 991px)" srcSet={mobileImage.url} />
      ) : null}
      {/* A plain img: Strapi serves from a separate origin whose domain
          changes per environment, so this avoids tying deploys to a
          next.config image allowlist. */}
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
