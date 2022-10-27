"use strict";

/**
 *  chapter controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::chapter.chapter", ({ strapi }) => {
  return {
    async findOne(ctx) {
      const { user } = ctx.state;

      if (!user) {
        return await super.findOne(ctx);
      }

      const currentUserId = user.id;
      const chapterId = ctx.params.id;

      //find course id curresponding to chapter id
      const chapterQuery = await strapi.db
        .query("api::chapter.chapter")
        .findOne({
          where: { id: chapterId },
          populate: {
            course: {
              select: ["id"],
            },
          },
        });
      const courseId = chapterQuery.course.id;
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
      // Here course id is not a param so toString is not needed
      const isPurchasedCourse = userPurchases.purchases.find((purchase) => {
        return purchase.course.id === courseId;
      });
      // if user not purchased the course, return chapter
      if (!isPurchasedCourse) {
        return await super.findOne(ctx);
      }

      // if user purchased the course
      return chapterQuery;
    },
  };
});
