import { supabase } from './supabase.js';

const workspace = document.getElementById("workspace");
const popup = document.getElementById("popup");
const nameInput = document.getElementById("lead-name");
const numberInput = document.getElementById("lead-number");
const statusButtons = document.querySelectorAll(".status-btn");
const popupTitle = document.getElementById("popup-title");
const emptyGuide = document.getElementById("empty-guide");

let leads = [];
let selectedStatus = null;
let editingId = null;

const statusSections = ["New", "Contacted", "Interested", "Not Interested", "Joined"];

window.openPopup = (id = null) => {
  editingId = id;
  popup.classList.remove("hidden");
  popup.classList.add("flex");

  if (id !== null) {
    const lead = leads.find(l => l.id === id);
    nameInput.value = lead.name;
    numberInput.value = lead.number;
    selectStatus(null, lead.status);
    popupTitle.innerText = "Edit Lead";
  } else {
    nameInput.value = "";
    numberInput.value = "";
    selectStatus(null);
    popupTitle.innerText = "Add New Lead";
  }
};

window.closePopup = () => {
  popup.classList.add("hidden");
  popup.classList.remove("flex");
};

window.selectStatus = (button, forceStatus = null) => {
  statusButtons.forEach(btn => btn.classList.remove("bg-black", "text-white"));
  if (button) {
    button.classList.add("bg-black", "text-white");
    selectedStatus = button.dataset.status;
  } else if (forceStatus) {
    selectedStatus = forceStatus;
    statusButtons.forEach(btn => {
      if (btn.dataset.status === forceStatus) {
        btn.classList.add("bg-black", "text-white");
      }
    });
  } else {
    selectedStatus = null;
  }
};

window.submitLead = async () => {
  const name = nameInput.value.trim();
  const number = numberInput.value.trim();

  if (!name || !/^\d{10}$/.test(number) || !selectedStatus) {
    alert("Please enter valid name, 10-digit number, and select a status.");
    return;
  }

  const newLead = {
    name,
    number,
    status: selectedStatus
  };

  if (editingId !== null) {
    await supabase.from("leads").update(newLead).eq("id", editingId);
  } else {
    await supabase.from("leads").insert([newLead]);
  }

  closePopup();
  fetchLeads();
};

async function fetchLeads() {
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  leads = data || [];
  renderLeads();
}

function renderLeads() {
  workspace.innerHTML = "";
  const hasLeads = leads.length > 0;

  if (!hasLeads) {
    emptyGuide.style.display = "block";
    workspace.appendChild(emptyGuide);
    return;
  }

  emptyGuide.style.display = "none";

  statusSections.forEach(status => {
    const sectionLeads = leads.filter(l => l.status === status);
    if (sectionLeads.length === 0) return;

    const section = document.createElement("section");
    section.classList.add("space-y-2");

    const title = document.createElement("div");
    title.className = `status-header status-${status.replace(" ", "-")}`;
    title.innerText = `${status} [${sectionLeads.length}]`;

    const list = document.createElement("div");
    list.className = "space-y-2";

    sectionLeads.forEach((lead) => {
      const card = document.createElement("div");
      card.className = "border border-gray-300 p-3 space-y-1";

      card.innerHTML = `
        <div class="text-sm">${lead.name}</div>
        <div class="text-xs text-gray-700">${lead.number}</div>
        <div class="flex gap-2 pt-2">
          <button onclick="openPopup(${lead.id})" class="border border-black px-2 py-1 text-xs">Edit</button>
          <a href="https://wa.me/${lead.number}" class="border border-black px-2 py-1 text-xs">Message</a>
          <a href="tel:${lead.number}" class="border border-black px-2 py-1 text-xs">Call</a>
        </div>
      `;
      list.appendChild(card);
    });

    section.appendChild(title);
    section.appendChild(list);
    workspace.appendChild(section);
  });
}

fetchLeads();