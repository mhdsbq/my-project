"use strict";

/**
 *  course controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::course.course", ({ strapi }) => {
  return {
    async findOne(ctx) {
      const { user } = ctx.state;

      if (!user) {
        return await super.findOne(ctx);
      }

      const currentUserId = user.id;
      const courseId = ctx.params.id;

      const userPurchases = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          select: ["username"],
          where: { id: currentUserId },
          populate: {
            purchases: {
              select: ["id"],
              populate: {
                course: {
                  select: ["id"],
                },
              },
            },
          },
        });
      // check if user has purchased the course
      const isPurchasedCourse = userPurchases.purchases.find((purchase) => {
        return purchase.course.id.toString() === courseId;
      });

      // if user has not purchased the course, return super.findOne
      if (!isPurchasedCourse) {
        return await super.findOne(ctx);
      }

      // if user has purchased the course, return the course
      const courseWithVideoLinks = await strapi.db
        .query("api::course.course")
        .findOne({
          where: { id: courseId },
          populate: {
            chapters: true,
          },
        });
      return { isPurchased: true, course: courseWithVideoLinks };
    },
    async findPurchasedCourses(ctx) {
      const { user } = ctx.state;
      const currentUserId = user.id;
      const query = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          select: ["username"],
          where: { id: currentUserId },
          populate: {
            purchases: {
              select: ["id"],
              populate: {
                course: true,
              },
            },
          },
        });

      let purchasedCourse = query.purchases.map((purchase) => {
        return purchase.course;
      });
      return purchasedCourse;
    },
  };
});
