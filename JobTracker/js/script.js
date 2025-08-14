const jobForm = document.getElementById('job-form');
const jobList = document.getElementById('job-list');
const companyInput = document.getElementById('company');
const roleInput = document.getElementById('role');
const statusInput = document.getElementById('status');
const dateInput = document.getElementById('date');
const searchInput = document.getElementById('search');

let jobs = JSON.parse(localStorage.getItem('jobs')) || [];
let editIndex = null;

const saveToLocalStorage = () => {
  localStorage.setItem('jobs', JSON.stringify(jobs));
};

const renderJobs = (filter = '') => {
  jobList.innerHTML = '';
  const filteredJobs = jobs.filter(job =>
    job.company.toLowerCase().includes(filter.toLowerCase()) ||
    job.role.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredJobs.length === 0) {
    jobList.innerHTML = `<p>No matching job applications found.</p>`;
    return;
  }

  filteredJobs.forEach((job, index) => {
    const jobItem = document.createElement('div');
    jobItem.className = 'job-item';

    jobItem.innerHTML = `
      <strong>${job.company}</strong> - ${job.role}
      <small>Status: <span class="badge ${job.status}">${job.status}</span> | Date: ${job.date}</small>
      <button class="delete-btn" onclick="deleteJob(${index})">Delete</button>
      <button class="delete-btn" style="right: 80px; background-color: #ffc107;" onclick="editJob(${index})">Edit</button>
    `;

    jobList.appendChild(jobItem);
  });
};

const deleteJob = (index) => {
  if (confirm('Are you sure you want to delete this job application?')) {
    jobs.splice(index, 1);
    saveToLocalStorage();
    renderJobs(searchInput.value);
  }
};

const editJob = (index) => {
  const job = jobs[index];
  companyInput.value = job.company;
  roleInput.value = job.role;
  statusInput.value = job.status;
  dateInput.value = job.date;
  editIndex = index;
};

const addJob = (e) => {
  e.preventDefault();

  const newJob = {
    company: companyInput.value.trim(),
    role: roleInput.value.trim(),
    status: statusInput.value,
    date: dateInput.value
  };

  if (editIndex !== null) {
    jobs[editIndex] = newJob;
    editIndex = null;
  } else {
    jobs.push(newJob);
  }

  saveToLocalStorage();
  renderJobs(searchInput.value);
  jobForm.reset();
};

jobForm.addEventListener('submit', addJob);
searchInput.addEventListener('input', () => renderJobs(searchInput.value));

window.deleteJob = deleteJob;
window.editJob = editJob;

renderJobs();
