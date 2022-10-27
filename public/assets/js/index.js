window.onload = getCouses();

function getCouses() {
  let requestOptions = {
    method: "GET",
  };

  fetch("/api/courses", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.error) {
        return Promise.reject(result.error);
      }
      let data = result.data;

      let coursesHtml = "";
      data.map((course) => {
        courseId = course.id;
        courseName = course.attributes.name;
        courseFee = course.attributes.fee;
        courseDuration = course.attributes.duration;
        coursesHtml += `<!-- coures start  -->
            <div class="col-lg-3 col-sm-6 courses-col">
              <div
                class="single-courses mt-30 wow fadeInUpBig"
                data-wow-duration="1s"
                data-wow-delay="0.2s"
              >
                <a href="#" class="category">#Science</a>
                <h4 class="courses-title">
                  <a href="courses-details.html?id=${courseId}">${courseName}</a>
                </h4>
                <div class="duration-fee">
                  <p class="duration">Duration: <span> ${courseDuration}</span></p>
                  <p class="fee">Fee: <span> ₹${courseFee}</span></p>
                </div>

                <div class="courses-link">
                    <a class="more" href="courses-details.html?id=${courseId}">
                        Read more <i class="fal fa-chevron-right"></i>
                    </a>
                </div>
              </div>
            </div>
            <!-- course end  -->`;
      });
      const coursesContainer = document.getElementById("courses-container");
      coursesContainer.innerHTML = coursesHtml;
    })
    .catch((error) => console.log("error", error));
}
