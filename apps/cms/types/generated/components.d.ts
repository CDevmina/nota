import type { Schema, Struct } from '@strapi/strapi';

export interface AudienceIntro extends Struct.ComponentSchema {
  collectionName: 'components_audience_intros';
  info: {
    description: '';
    displayName: 'Audience Intro';
    icon: 'align-left';
  };
  attributes: {
    paragraph: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface AudienceItem extends Struct.ComponentSchema {
  collectionName: 'components_audience_items';
  info: {
    description: '';
    displayName: 'Audience Item';
    icon: 'user';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    indentLevel: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ColorwayItem extends Struct.ComponentSchema {
  collectionName: 'components_colorway_items';
  info: {
    description: '';
    displayName: 'Colourway';
    icon: 'paint';
  };
  attributes: {
    gradientEnd: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'#ffffff'>;
    gradientStart: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'#000000'>;
    media: Schema.Attribute.Component<'shared.media', false>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    tagline: Schema.Attribute.String & Schema.Attribute.Required;
    textColor: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'#ffffff'>;
  };
}

export interface FeatureSlide extends Struct.ComponentSchema {
  collectionName: 'components_feature_slides';
  info: {
    description: '';
    displayName: 'Feature Slide';
    icon: 'slideshow';
  };
  attributes: {
    cardBody: Schema.Attribute.Text & Schema.Attribute.Required;
    cardTitle: Schema.Attribute.String & Schema.Attribute.Required;
    headlineBottom: Schema.Attribute.String;
    headlineMiddle: Schema.Attribute.String;
    headlineTop: Schema.Attribute.String & Schema.Attribute.Required;
    media: Schema.Attribute.Component<'shared.media', false>;
  };
}

export interface InsideProduct extends Struct.ComponentSchema {
  collectionName: 'components_inside_products';
  info: {
    description: '';
    displayName: 'Product Card';
    icon: 'shoppingCart';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    media: Schema.Attribute.Component<'shared.media', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface InsideTag extends Struct.ComponentSchema {
  collectionName: 'components_inside_tags';
  info: {
    description: '';
    displayName: 'Pill Tag';
    icon: 'priceTag';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    media: Schema.Attribute.Component<'shared.media', false>;
  };
}

export interface SectionsAudience extends Struct.ComponentSchema {
  collectionName: 'components_sections_audiences';
  info: {
    description: "Who it's for \u2014 intro paragraphs then staggered audience blocks.";
    displayName: 'Audience';
    icon: 'user';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    intro: Schema.Attribute.Component<'audience.intro', true>;
    items: Schema.Attribute.Component<'audience.item', true>;
    label: Schema.Attribute.String;
  };
}

export interface SectionsColorways extends Struct.ComponentSchema {
  collectionName: 'components_sections_colorways';
  info: {
    description: 'Sticky-camera morph between colourway states.';
    displayName: 'Colourways';
    icon: 'paint';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    items: Schema.Attribute.Component<'colorway.item', true>;
  };
}

export interface SectionsFeatures extends Struct.ComponentSchema {
  collectionName: 'components_sections_features';
  info: {
    description: 'Sticky-camera carousel with a segmented progress bar.';
    displayName: 'Feature Carousel';
    icon: 'slideshow';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    slides: Schema.Attribute.Component<'feature.slide', true>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heros';
  info: {
    description: 'Full-bleed pen render with a two-line display headline.';
    displayName: 'Hero';
    icon: 'picture';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    headlineBottom: Schema.Attribute.String & Schema.Attribute.Required;
    headlineTop: Schema.Attribute.String & Schema.Attribute.Required;
    media: Schema.Attribute.Component<'shared.media', false>;
  };
}

export interface SectionsInsideBox extends Struct.ComponentSchema {
  collectionName: 'components_sections_inside_boxes';
  info: {
    description: 'Circular mask reveal, box render, product cards and pill tags.';
    displayName: 'Inside The Box';
    icon: 'cube';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    boxMedia: Schema.Attribute.Component<'shared.media', false>;
    description: Schema.Attribute.Text;
    longCopy: Schema.Attribute.Text;
    products: Schema.Attribute.Component<'inside.product', true>;
    subtitle: Schema.Attribute.String;
    tags: Schema.Attribute.Component<'inside.tag', true>;
    titleBottom: Schema.Attribute.String & Schema.Attribute.Required;
    titleTop: Schema.Attribute.String;
  };
}

export interface SectionsManifesto extends Struct.ComponentSchema {
  collectionName: 'components_sections_manifestos';
  info: {
    description: 'Large serif statement on black, lightening as it scrolls.';
    displayName: 'Manifesto';
    icon: 'quote';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    showRule: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface SectionsPreloader extends Struct.ComponentSchema {
  collectionName: 'components_sections_preloaders';
  info: {
    description: 'Full-screen 0\u2013100 counter that lifts to reveal the hero.';
    displayName: 'Preloader';
    icon: 'clock';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    brandMark: Schema.Attribute.Media<'images'>;
    durationMs: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1400>;
    suffix: Schema.Attribute.String & Schema.Attribute.DefaultTo<'%'>;
  };
}

export interface SectionsSpecifications extends Struct.ComponentSchema {
  collectionName: 'components_sections_specifications';
  info: {
    description: 'Split heading, rising nib render, and cards that expand into lists.';
    displayName: 'Specifications';
    icon: 'layer';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    groups: Schema.Attribute.Component<'spec.group', true>;
    media: Schema.Attribute.Component<'shared.media', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsTransition extends Struct.ComponentSchema {
  collectionName: 'components_sections_transitions';
  info: {
    description: 'Oversized two-tone serif heading spanning the viewport.';
    displayName: 'Transition Heading';
    icon: 'typhoon';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    lineBottom: Schema.Attribute.String & Schema.Attribute.Required;
    lineTop: Schema.Attribute.String & Schema.Attribute.Required;
    mutedColor: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#666666'>;
    theme: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.DefaultTo<'light'>;
  };
}

export interface SharedCredit extends Struct.ComponentSchema {
  collectionName: 'components_shared_credits';
  info: {
    description: '';
    displayName: 'Credit';
    icon: 'user';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    description: '';
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    currency: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'$'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.Decimal;
    productName: Schema.Attribute.String;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    description: '';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_medias';
  info: {
    description: '';
    displayName: 'Media';
    icon: 'picture';
  };
  attributes: {
    alt: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    mobileImage: Schema.Attribute.Media<'images'>;
    mobileVideo: Schema.Attribute.Media<'videos'>;
    poster: Schema.Attribute.Media<'images'>;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface SharedOrderModal extends Struct.ComponentSchema {
  collectionName: 'components_shared_order_modals';
  info: {
    description: '';
    displayName: 'Order Modal';
    icon: 'envelop';
  };
  attributes: {
    closeLabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Close'>;
    description: Schema.Attribute.Text;
    emailPlaceholder: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'E-mail'>;
    errorMessage: Schema.Attribute.String & Schema.Attribute.Required;
    requiredMessage: Schema.Attribute.String & Schema.Attribute.Required;
    submitLabel: Schema.Attribute.String & Schema.Attribute.Required;
    successMessage: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    noindex: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SpecGroup extends Struct.ComponentSchema {
  collectionName: 'components_spec_groups';
  info: {
    description: '';
    displayName: 'Spec Group';
    icon: 'layer';
  };
  attributes: {
    items: Schema.Attribute.Component<'spec.item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SpecItem extends Struct.ComponentSchema {
  collectionName: 'components_spec_items';
  info: {
    description: '';
    displayName: 'Spec Item';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'audience.intro': AudienceIntro;
      'audience.item': AudienceItem;
      'colorway.item': ColorwayItem;
      'feature.slide': FeatureSlide;
      'inside.product': InsideProduct;
      'inside.tag': InsideTag;
      'sections.audience': SectionsAudience;
      'sections.colorways': SectionsColorways;
      'sections.features': SectionsFeatures;
      'sections.hero': SectionsHero;
      'sections.inside-box': SectionsInsideBox;
      'sections.manifesto': SectionsManifesto;
      'sections.preloader': SectionsPreloader;
      'sections.specifications': SectionsSpecifications;
      'sections.transition': SectionsTransition;
      'shared.credit': SharedCredit;
      'shared.cta': SharedCta;
      'shared.link': SharedLink;
      'shared.media': SharedMedia;
      'shared.order-modal': SharedOrderModal;
      'shared.seo': SharedSeo;
      'spec.group': SpecGroup;
      'spec.item': SpecItem;
    }
  }
}
