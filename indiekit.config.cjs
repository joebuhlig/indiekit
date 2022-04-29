const postTypes = [{
  type: 'article',
  name: 'Article',
  post: {
    path: '_posts/{yyyy}-{MM}-{dd}-{slug}.md',
    url: '{slug}/'
  },
  media: {
    path: '_assets/media/{yyyy}-{MM}-{dd}-{slug}.{ext}',
    url: 'media/{yyyy}/{MM}/{dd}/{slug}.{ext}'
  }
},{
  type: 'note',
  name: 'Note',
  post: {
    path: '_notes/{yyyy}-{MM}-{dd}-{slug}.md',
    url: 'note/{yyyy}/{MM}/{dd}/{slug}/'
  },
  media: {
    path: '_assets/media/{yyyy}-{MM}-{dd}-{slug}.{ext}',
    url: 'media/{yyyy}/{MM}/{dd}/{slug}.{ext}'
  }
},{
  type: 'photo',
  name: 'Photo',
  post: {
    path: '_photos/{yyyy}-{MM}-{dd}-{slug}.md',
    url: 'photo/{yyyy}/{MM}/{dd}/{slug}/'
  },
  media: {
    path: '_assets/media/{yyyy}-{MM}-{dd}-{slug}.{ext}',
    url: 'media/{yyyy}/{MM}/{dd}/{slug}.{ext}'
  }
},{
  type: 'video',
  name: 'Video',
  post: {
    path: '_videos/{yyyy}-{MM}-{dd}-{slug}.md',
    url: 'video/{yyyy}/{MM}/{dd}/{slug}/'
  },
  media: {
    path: '_assets/media/{yyyy}-{MM}-{dd}-{slug}.{ext}',
    url: 'media/{yyyy}/{MM}/{dd}/{slug}.{ext}'
  }
},{
  type: 'bookmark',
  name: 'Bookmark',
  post: {
    path: '_bookmarks/{yyyy}-{MM}-{dd}-{slug}.md',
    url: 'bookmark/{yyyy}/{MM}/{dd}/{slug}/'
  }
},{
  type: 'reply',
  name: 'Reply',
  post: {
    path: '_replies/{yyyy}-{MM}-{dd}-{slug}.md',
    url: 'reply/{yyyy}/{MM}/{dd}/{slug}/'
  },
  media: {
    path: '_assets/media/{yyyy}-{MM}-{dd}-{slug}.{ext}',
    url: 'media/{yyyy}/{MM}/{dd}/{slug}.{ext}'
  }
},{
  type: 'like',
  name: 'Like',
  post: {
    path: '_likes/{yyyy}-{MM}-{dd}-{slug}.md',
    url: 'like/{yyyy}/{MM}/{dd}/{slug}/'
  }
},{
  type: 'repost',
  name: 'Repost',
  post: {
    path: '_reposts/{yyyy}-{MM}-{dd}-{slug}.md',
    url: 'repost/{yyyy}/{MM}/{dd}/{slug}/'
  }
},{
  type: 'event',
  name: 'Event',
  post: {
    path: '_events/{yyyy}-{MM}-{dd}-{slug}.md',
    url: 'event/{yyyy}/{MM}/{dd}/{slug}/'
  },
  media: {
    path: '_assets/media/{yyyy}-{MM}-{dd}-{slug}.{ext}',
    url: 'media/{yyyy}/{MM}/{dd}/{slug}.{ext}'
  }
},{
  type: 'Steps',
  name: 'Steps',
  post: {
    path: '_steps/{yyyy}-{MM}-{dd}-{slug}.md',
    url: 'steps/{yyyy}-{MM}-{dd}/'
  }
}];

const storeMessageTemplate = metaData => {
  const {result, postType, fileType} = metaData;
  return `🤖 ${result} a ${postType} ${fileType}`;
};

const syndicationTargets = [{
  info: {
    uid: 'https://twitter.com/joebuhlig/',
    name: 'joebuhlig@twitter.com'}
}, {
  info: {
    uid: 'https://mastodon.social/@joebuhlig',
    name: '@joebuhlig@mastodon.social'}
}, {
  info: {
    uid: 'https://flickr.com/joebuhlig',
    name: 'joebuhlig@flickr.com'}
}, {
  info: {
    uid: 'https://instagram.com/joebuhlig',
    name: 'joebuhlig@instagram.com'}
}, {
  info: {
    uid: 'https://reddit.com/r/joebuhlig',
    name: '/r/joebuhlig@reddit.com'}
}, {
  info: {
    uid: 'https://medium.com/joebuhlig-com',
    name: 'joebuhlig-com@medium.com'}
}, {
  info: {
    uid: 'https://tumblr.com/blog/joebuhlig',
    name: 'joebuhlig@tumblr.com'}
}]

module.exports = {
  plugins: [
    "@indiekit/preset-jekyll",
    "@indiekit/store-github",
    "@indiekit/syndicator-mastodon",
    "@indiekit/syndicator-twitter",
  ],
  publication: {
    me: "https://joebuhlig.com",
    locale: "en-US",
    timeZone: "America/Chicago",
    preset: "jekyll",
    postTypes: postTypes,
    storeMessageTemplate: storeMessageTemplate,
    syndicationTargets: syndicationTargets
  },
  "@indiekit/store-github": {
    user: "getindiekit",
    repo: "sandbox",
    branch: "gh-pages",
  },
  "@indiekit/syndicator-mastodon": {
    checked: true,
    forced: true,
    url: "https://mastodon.social",
    user: "indiekit_sandbox",
  },
  "@indiekit/syndicator-twitter": {
    checked: true,
    forced: true,
    user: "indiekitsandbox",
  },
};
