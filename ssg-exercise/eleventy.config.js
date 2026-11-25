export default function (eleventyConfig) {
  // Copy static assets to _site unchanged.
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  return {
    dir: { input: "src", output: "_site", includes: "_includes" }
  };
}
