import { jobsData } from "./data.js";

const inputSearch = document.getElementById("searchInput");
const JobsContainer = document.querySelector(".all-jobs-container");
const main = document.getElementsByTagName("main")[0];
const searchHistoryContainer = document.querySelector(
  ".search-history-container"
);

const searchKeys = [];

const createJobListing = (job) => {
  const jobContainer = document.createElement("div");
  jobContainer.classList.add("job-container");
  JobsContainer.appendChild(jobContainer);

  const jobDescription = document.createElement("div");
  jobDescription.classList.add("job-description");
  jobContainer.appendChild(jobDescription);

  const companyLogo = document.createElement("img");
  companyLogo.src = `${job.logo}`;
  companyLogo.alt = "company logo";
  companyLogo.classList.add("company-logo");

  const jobDetails = document.createElement("div");
  jobDetails.classList.add("job-details");

  jobDescription.append(companyLogo, jobDetails);

  const companyDetails = document.createElement("div");
  companyDetails.classList.add("company-details");

  const position = document.createElement("h3");
  position.classList.add("position");
  position.textContent = `${job.position}`;

  const moreDetails = document.createElement("div");
  moreDetails.classList.add("more-details");

  jobDetails.append(companyDetails, position, moreDetails);

  const companyName = document.createElement("span");
  companyName.classList.add("company-name");
  companyName.textContent = `${job.company}`;
  companyDetails.appendChild(companyName);

  if (job.new) {
    const isNew = document.createElement("span");
    isNew.classList.add("new");
    isNew.textContent = "New!";
    companyDetails.appendChild(isNew);
  }

  if (job.featured) {
    const isFeatured = document.createElement("span");
    isFeatured.classList.add("featured");
    isFeatured.textContent = "featured";
    companyDetails.appendChild(isFeatured);
    jobContainer.style.borderLeft = "10px solid hsl(180, 29%, 50%)";
  }

  const postedAt = document.createElement("span");
  postedAt.textContent = job.postedAt;

  const contract = document.createElement("span");
  contract.textContent = `-  ${job.contract}`;

  const location = document.createElement("span");
  location.textContent = `-  ${job.location}`;

  moreDetails.append(postedAt, contract, location);

  const rolesAndTools = document.createElement("div");
  rolesAndTools.classList.add("role-and-tools");
  jobContainer.appendChild(rolesAndTools);

  const role = document.createElement("span");
  role.classList.add("role");
  role.textContent = job.role;
  rolesAndTools.appendChild(role);

  const level = document.createElement("span");
  level.classList.add("level");
  level.textContent = job.level;
  rolesAndTools.appendChild(level);

  if (job.languages.length > 0) {
    job.languages.forEach((language) => {
      const languageEl = document.createElement("span");
      languageEl.classList.add("languages");
      languageEl.textContent = language;
      rolesAndTools.appendChild(languageEl);
    });
  }

  if (job.tools.length > 0) {
    job.tools.forEach((tool) => {
      const toolEl = document.createElement("span");
      toolEl.classList.add("tools");
      toolEl.textContent = tool;
      rolesAndTools.appendChild(toolEl);
    });
  }
};

const displayNoResultsScreen = () => {
  const noResult = document.createElement("div");
  noResult.classList.add("no-result");
  noResult.textContent = "No Results Found";
  JobsContainer.appendChild(noResult);
};

const renderJobList = (jobs) => {
  JobsContainer.innerHTML = "";
  jobs.length === 0
    ? displayNoResultsScreen()
    : jobs.forEach((job) => {
        createJobListing(job);
      });
};

const isKeysMatchJob = (job) => {
  const isMatch = searchKeys.every((key) => {
    key = key.trim().toLowerCase();
    return (
      key === job.role.toLowerCase() ||
      key === job.level.toLowerCase() ||
      job.languages.map((job) => job.toLowerCase()).includes(key) ||
      job.tools.map((tool) => tool.toLowerCase()).includes(key)
    );
  });

  return isMatch;
};

const getFilterdJobs = () => {
  const filteredJobs = jobsData.filter((job) => {
    return isKeysMatchJob(job);
  });
  return filteredJobs;
};

const removeSearchKey = (e) => {
  const searchKeyParent = e.target.parentElement;
  searchKeyParent.style.display = "none";
  const deletedKey = searchKeyParent.querySelector(".search-key").textContent;


  searchKeys.splice(searchKeys.indexOf(deletedKey), 1);
  searchKeys.length === 0 ? (searchHistoryContainer.innerHTML = "") : null;

  const filteredJob = getFilterdJobs();
  renderJobList(filteredJob);
};

const clearAllKeys = () => {
  searchKeys.length = 0;
  searchHistoryContainer.innerHTML = "";
  const filteredJobs = getFilterdJobs();
  renderJobList(filteredJobs);
};

const displaySearchHistory = () => {
  searchHistoryContainer.innerHTML = "";

  searchKeys.forEach((key) => {
    const keyContainer = document.createElement("div");
    keyContainer.classList.add("key-container");
    searchHistoryContainer.appendChild(keyContainer);

    const keyEl = document.createElement("span");
    keyEl.classList.add("search-key");
    keyEl.textContent = key;
    keyContainer.appendChild(keyEl);

    const cencel = document.createElement("span");
    cencel.classList.add("search-key");
    cencel.textContent = "X";
    keyContainer.appendChild(cencel);
    cencel.addEventListener("click", removeSearchKey);
  });

  const clear = document.createElement("span");
  clear.classList.add("clear");
  clear.textContent = "Clear";
  searchHistoryContainer.appendChild(clear);
  clear.addEventListener("click", clearAllKeys);
};

const handleSearch = (e) => {
  if (e.key === "Enter") {
    const inputValue = e.target.value;

    if (!searchKeys.includes(inputValue)) {
      searchKeys.push(inputValue);
      const filteredJobs = getFilterdJobs();
      renderJobList(filteredJobs);
      displaySearchHistory();
    }
    e.target.value = "";
  }
};

inputSearch.addEventListener("keydown", handleSearch);

window.onload = () => renderJobList(jobsData);
