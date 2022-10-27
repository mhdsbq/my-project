"use strict";

const { createCoreRouter } = require("@strapi/strapi").factories;
const defaultRouter = createCoreRouter("api::course.course");

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      routes = extraRoutes.concat(innerRouter.routes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: "GET",
    path: "/course/purchased-courses",
    handler: "api::course.course.findPurchasedCourses",
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
