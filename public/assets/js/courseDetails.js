window.onload = pageHandler();

// get course id from url query

function pageHandler() {
  const courseId = getCourseId();
  // populate page with data using fetch api
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`/api/courses/${courseId}?populate=%2A`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.error) {
        error = result.error;
        return Promise.reject(error);
      }

      // populate page with data
      let courseDetaills = result.data.attributes;

      document.getElementById("course-name").innerHTML = courseDetaills.name;
      document.getElementById("course-description").innerHTML =
        courseDetaills.description;
      document.getElementById("course-duration").innerHTML =
        courseDetaills.duration;
      document.getElementById(
        "course-fee"
      ).innerHTML = `₹${courseDetaills.fee}`;

      //populate chapters
      let chapters = result.data.attributes.chapters.data;
      chapters = chapters.map((chapter) => {
        return {
          chapterNumber: chapter.attributes.chapterNumber,
          name: chapter.attributes.name,
        };
      });
      chapters = chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
      let chapterList = document.getElementsByClassName("single-curriculum")[0];
      chaptersListInnerHtml = ``;
      chapters.map((chapter) => {
        chaptersListInnerHtml += `<li>
        <a href="#"
        ><i class="fal fa-book"></i> Lessons ${chapter.chapterNumber}:
        ${chapter.name}</a
        >
        </li>`;
      });
      chapterList.innerHTML = `<ul class="curriculum-list">${chaptersListInnerHtml}<ul>`;
      console.log(chapterList);
    })
    .catch((error) => console.log("error", error));
}
function getCourseId() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  let value = params.id;
  return value;
}
