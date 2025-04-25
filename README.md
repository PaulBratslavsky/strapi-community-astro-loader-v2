# Strapi Community Astro Loader v2

This package is a community-driven Astro loader for Strapi. 

It allows you to fetch content from a Strapi API and use it in your Astro project. 

note: this is a work in progress.

## Installation

```bash
npm install strapi-community-astro-loader-v2
```

## Usage

``` ts
import { strapiLoader } from "strapi-community-astro-loader-v2";


// pass the collection type name to the loader
const strapiPostsLoader = defineCollection({
  loader: strapiLoader({ contentType: "articles" }),
});

```

You can now pass populate options to the loader. Using the params object you can pass populate options to the loader.

``` ts
const strapiPostsLoader = defineCollection({
  loader: strapiLoader({ contentType: "articles", params: { populate: "*" } }),
});
```

## License

MIT

For questions, contributions, and support, please open an issue on GitHub.

# strapi-community-astro-loader-v2
