const COURSES_URL = "/api/courses";
const COUSES_PER_PAGE = 12;
const DISPLAYED_RESULTS_FROM_TO_TEXT_ID = "#displayed-results-text"; //eg: Showing 1 - 16 of 36 results
const COURSE_CONTAINER_ID = "#courses-container";
const PAGINATION_ID = "#pagination";

// state mngmnt
const state = {
  courses: [],
  courseCount: 0,
  coursePerPage: COUSES_PER_PAGE,
  pageCount: 0,
  currentPage: 1,
  currentPageState: {
    courses: [],
    courseCount: 0,
    courseStartingIndex: 0,
    courseEndingIndex: 0,
  },
  setCourses(courses) {
    this.courses = courses;
    this.courseCount = courses.length;
    this.pageCount = Math.ceil(this.courseCount / this.coursePerPage);
    this.setCurrentPageState(1);
    return this;
  },
  setCurrentPageState(pageNumber) {
    if (this.pageIsValied(pageNumber)) {
      let startingIdx = (pageNumber - 1) * this.coursePerPage;
      let endingIdx = Math.min(
        startingIdx + this.coursePerPage,
        this.courseCount
      );
      let courses = this.courses.slice(startingIdx, endingIdx);
      this.currentPageState.courses = courses;
      this.currentPageState.courseCount = this.courses.length;
      this.currentPageState.courseStartingIndex = startingIdx;
      this.currentPageState.courseEndingIndex = endingIdx;

      this.currentPage = pageNumber;
      return this;
    }
    console.log("This Page Doesnot Exist...");
    return this;
  },
  pageIsValied(pageNumber) {
    return pageNumber > 0 && pageNumber <= this.pageCount;
  },
  nextPage() {
    let nextPageNumber = this.currentPage + 1;
    return this.setCurrentPageState(nextPageNumber);
  },
  previousPage() {
    let prevPageNumber = this.currentPage - 1;
    return this.setCurrentPageState(prevPageNumber);
  },
};
// Entry points
window.addEventListener("load", coursePageHandler);
// TO DO
//  - next page on click

//Main Functions
async function coursePageHandler() {
  const requestOptions = createRequestOptions();
  const response = await fetchCourses(COURSES_URL, requestOptions);
  const courses = response.data;
  setCourses(courses);

  return;
}

// Helper Functions
async function fetchCourses(url, options) {
  const requestOptions = createRequestOptions(options); // default options
  const response = await fetch(url, requestOptions);
  const data = await response.json();
  return data;
}

function createRequestOptions() {
  return {
    method: "GET",
    redirect: "follow",
  };
}

function previousPage() {
  state.previousPage();
  renderDom(state);
}

function nextPage() {
  state.nextPage();
  renderDom(state);
}

function setCourses(courses) {
  state.setCourses(courses);
  renderDom(state);
}

function renderDom(state) {
  //TODO :-
  //  - remove all event listners on starting
  //  - add event listner to listen click on next page and impliment them

  // render html according to the state of the page
  const { pageCount, currentPage } = state;
  const { courses, courseCount, courseStartingIndex, courseEndingIndex } =
    state.currentPageState;

  // showing x to y of z results thingy...
  const displayedResultsFromToText = `Showing ${
    courseStartingIndex + 1
  } - ${courseEndingIndex} of ${courseCount} results`;
  ele(DISPLAYED_RESULTS_FROM_TO_TEXT_ID).innerHTML = displayedResultsFromToText;

  //display actual courses
  let courseHtml = "";
  courses.map(function (course) {
    const { id, attributes } = course;
    const { name, fee, description, duration } = attributes;
    courseHtml += `<div class="col-lg-3 col-sm-6 courses-col">
                  <div class="single-courses-2 mt-30">
                    <div class="courses-image">
                      <a href="#"
                        ><img
                          src="assets/images/courses/courses-5.webp"
                          width="270"
                          height="170"
                          alt="courses"
                      /></a>
                    </div>
                    <div class="courses-content">
                      <a href="#" class="category">#Science</a>
                      <h4 class="courses-title">
                        <a href="courses-details.html?id=${id}"
                          >${name}</a
                        >
                      </h4>
                      <div class="duration-rating">
                        <div class="duration-fee">
                          <p class="duration">Duration: <span> ${duration}</span></p>
                          <p class="fee">Fee: <span> ₹${fee}</span></p>
                        </div>
                        <div class="rating">
                          <span>Rating: </span>
                          <ul class="star">
                            <li><i class="fas fa-star"></i></li>
                            <li><i class="fas fa-star"></i></li>
                            <li><i class="fas fa-star"></i></li>
                            <li><i class="fas fa-star"></i></li>
                            <li><i class="fas fa-star"></i></li>
                          </ul>
                        </div>
                      </div>
                      <div class="courses-link">
                        <a class="apply" href="#">Online Apply</a>
                        <a class="more" href="#"
                          >Read more <i class="fal fa-chevron-right"></i
                        ></a>
                      </div>
                    </div>
                  </div>
                </div>`;
  });
  ele(COURSE_CONTAINER_ID).innerHTML = courseHtml;

  // display page selector - pagination
  let paginationHtml = "";
  for (let i = 1; i <= pageCount; i++) {
    let pageNum = ("0" + 1).slice(-2);

    // give class active to currnt page
    if (i == currentPage) {
      paginationHtml += `
      <li><a class="active" href="#">${pageNum}</a></li>
      `;
    } else {
      paginationHtml += paginationHtml += `
      <li><a href="#">${pageNum}</a></li>
      `;
    }
  }
  ele(PAGINATION_ID).innerHTML = paginationHtml;
  return;
}

function ele(q) {
  const e = document.querySelectorAll(q);
  return e.length > 1 ? e : e[0];
}
