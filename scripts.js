const petShop = {
  pets: [],
  vets: [],

  addPet(name, type, age) {
    this.pets.push({ name, type, age, medicalRecords: [] });
    updatePetsTable();
    updateSelectOptions();
  },

  addVet(name, specialization) {
    this.vets.push({ name, specialization });
    updateVetsTable();
    updateSelectOptions();
  },

  assignVetToPet(vetName, petName) {
    const vetToBeAssigned = this.vets.find((v) => v.name === vetName);
    const petToBeAssigned = this.pets.find((p) => p.name === petName);

    if (vetToBeAssigned && petToBeAssigned) {
      document.getElementById(
        "assignmentList"
      ).innerHTML += `<li>${vetToBeAssigned.name} is assigned to ${petToBeAssigned.name}</li>`;
    }
  },

  removePet(index) {
    this.pets.splice(index, 1);
    updatePetsTable();
    updateSelectOptions();
  },

  removeVet(index) {
    this.vets.splice(index, 1);
    updateVetsTable();
    updateSelectOptions();
  },

  openMedicalRecordModal(index) {
    const pet = this.pets[index];
    const modal = document.getElementById("medicalRecordModal");
    const modalTitle = document.getElementById("modalTitle");
    const medicalRecordList = document.getElementById("medicalRecordList");
    const noRecordsMessage = document.getElementById("noRecordsMessage");

    // Show the modal
    modal.style.display = "block";
    modalTitle.innerText = `${pet.name}'s Medical Records`;

    // Ensure previous content is cleared
    medicalRecordList.innerHTML = "";

    document
      .getElementById("medicalRecordModal")
      .setAttribute("data-index", index);

    if (!pet.medicalRecords || pet.medicalRecords.length === 0) {
      noRecordsMessage.classList.remove("hidden");
      medicalRecordList.classList.add("hidden");
    } else {
      noRecordsMessage.classList.add("hidden");
      medicalRecordList.classList.remove("hidden");
      medicalRecordList.innerHTML = pet.medicalRecords
        .map((record) => `<li>📝 ${record}</li>`)
        .join("");
    }
  },

  addMedicalRecord(index, record) {
    // Ensure the pet has a medicalRecords array
    if (!this.pets[index].medicalRecords) {
      this.pets[index].medicalRecords = [];
    }

    // Add the valid record
    this.pets[index].medicalRecords.push(record.trim());

    // Refresh the modal immediately
    this.openMedicalRecordModal(index);
  },
};

function closeMedicalRecordModal() {
  document.getElementById("medicalRecordModal").style.display = "none";
}

function showAddRecordInput() {
  // Get the pet index stored in the modal
  const index = parseInt(
    document.getElementById("medicalRecordModal").getAttribute("data-index")
  );

  document.getElementById("addRecordSection").innerHTML = `
    <input type="text" id="newMedicalRecord" placeholder="Enter Medical Record" class="p-2 border rounded w-full">
    <button onclick="confirmAddMedicalRecord(${index})" class="bg-green-500 text-white px-4 py-2 rounded mt-2">✅ Confirm</button>
    <button onclick="cancelAddMedicalRecord()" class="bg-red-500 text-white px-4 py-2 rounded mt-2">❌ Cancel</button>
  `;
}

function confirmAddMedicalRecord(index) {
  const recordInput = document.getElementById("newMedicalRecord");

  if (!recordInput || !recordInput.value.trim()) {
    alert("Please enter a valid medical record.");
    return;
  }

  // Pass trimmed value to prevent empty or undefined entries
  petShop.addMedicalRecord(index, recordInput.value.trim());

  // Clear the input field after adding
  document.getElementById("addRecordSection").innerHTML = "";

  // Refresh modal to reflect changes
  petShop.openMedicalRecordModal(index);
}

function cancelAddMedicalRecord() {
  document.getElementById("addRecordSection").innerHTML = "";
}

function cancelAddMedicalRecord() {
  document.getElementById("addRecordSection").innerHTML = "";
}

// DOM handling Logic
function addPet() {
  const name = document.getElementById("petName").value.trim();
  const type = document.getElementById("petType").value.trim();
  const age = document.getElementById("petAge").value.trim();

  if (!name || !type || !age) {
    alert("Please fill all fields!");
    return;
  }

  petShop.addPet(name, type, age);

  // Clear input fields
  document.getElementById("petName").value = "";
  document.getElementById("petType").value = "";
  document.getElementById("petAge").value = "";
}

function addVet() {
  const name = document.getElementById("vetName");
  const specialization = document.getElementById("vetSpecialization");

  if (name.value && specialization.value) {
    petShop.addVet(name.value, specialization.value);
    name.value = "";
    specialization.value = "";
  }
}

function updatePetsTable() {
  const petsTable = document.getElementById("petsTable");

  petsTable.innerHTML = petShop.pets
    .map((pet, index) => {
      return `
          <tr>
              <td class="px-4 py-2">${pet.name}</td>
              <td class="px-4 py-2">${pet.type}</td>
              <td class="px-4 py-2">${pet.age}</td>
              <td class="px-4 py-2">
                  <button onclick="petShop.removePet(${index})">🗑 Remove</button>
                  <button onclick="petShop.openMedicalRecordModal(${index})">📋 Medical Records</button>
              </td>
          </tr>
          `;
    })
    .join("");
}

function updateVetsTable() {
  const vetsTable = document.getElementById("vetsTable");

  vetsTable.innerHTML = petShop.vets
    .map(
      (vet, index) => `
      <tr>
        <td class="px-4 py-2">${vet.name}</td>
        <td class="px-4 py-2">${vet.specialization}</td>
        <td class="px-4 py-2"><button onclick="petShop.removeVet(${index})">🗑 Remove</button></td>
      </tr>
    `
    )
    .join("");
}

function assignVetToPet() {
  const petName = document.getElementById("assignPet").value;
  const vetName = document.getElementById("assignVet").value;

  if (!petName || !vetName) {
    alert("Please select both a pet and a vet.");
    return;
  }

  petShop.assignVetToPet(vetName, petName);
}

function updateSelectOptions() {
  document.getElementById("assignPet").innerHTML = petShop.pets
    .map((pet) => `<option>${pet.name}</option>`)
    .join("");

  document.getElementById("assignVet").innerHTML = petShop.vets
    .map((vet) => `<option>${vet.name}</option>`)
    .join("");
}

function searchPets() {
  const query = document.getElementById("searchPets").value.toLowerCase();
  const filteredPets = petShop.pets.filter((pet) =>
    pet.name.toLowerCase().includes(query)
  );

  document.getElementById("petsTable").innerHTML = filteredPets
    .map(
      (pet, index) => `
      <tr>
        <td>${pet.name}</td>
        <td>${pet.type}</td>
        <td>${pet.age}</td>
        <td class="px-4 py-2">
            <button onclick="petShop.removePet(${index})">🗑 Remove</button>
            <button onclick="petShop.openMedicalRecordModal(${index})">📋 Medical Records</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function searchVets() {
  const query = document.getElementById("searchVets").value.toLowerCase();
  const filteredVets = petShop.vets.filter((vet) =>
    vet.name.toLowerCase().includes(query)
  );

  document.getElementById("vetsTable").innerHTML = filteredVets
    .map(
      (vet, index) => `
      <tr>
        <td>${vet.name}</td>
        <td>${vet.specialization}</td>
        <td class="px-4 py-2"><button onclick="petShop.removeVet(${index})">🗑 Remove</button></td>
      </tr>
    `
    )
    .join("");
}

document.body.innerHTML += `
  <div id="medicalRecordModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:white; padding:20px; border:1px solid black;">
    <div id="medicalRecordContent"></div>
  </div>
`;

document
  .querySelector("#addVetButton")
  .addEventListener("click", () => addVet());
