document.addEventListener('DOMContentLoaded', function() {
  // References to DOM elements
  const dropdownContainers = document.querySelectorAll('.dropdown-container');
  const copyButton = document.getElementById('copy-button');
  const resultPreview = document.getElementById('result-preview');
  const toast = document.getElementById('toast');
  
  // Maps for storing question data
  const questionTitles = {
    'project-type': 'Тип проекта',
    'target-audience': 'Целевая аудитория',
    'project-goal': 'Цель проекта',
    'design-style': 'Стиль дизайна',
    'color-scheme': 'Цветовая схема'
  };
  
  // Initialize selected options
  const selectedOptions = {
    'project-type': [],
    'target-audience': [],
    'project-goal': [],
    'design-style': [],
    'color-scheme': []
  };
  
  // Open all dropdowns by default
  dropdownContainers.forEach(container => {
    container.classList.add('open');
  });
  
  // Toggle dropdown when header is clicked
  dropdownContainers.forEach(container => {
    const header = container.querySelector('.dropdown-header');
    header.addEventListener('click', () => {
      container.classList.toggle('open');
    });
  });
  
  // Handle checkbox changes
  document.querySelectorAll('.option input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const optionId = this.id;
      const optionLabel = this.nextElementSibling.textContent;
      const questionId = this.closest('.dropdown-container').id;
      
      if (this.checked) {
        // Add option to selected options
        selectedOptions[questionId].push({
          id: optionId,
          text: optionLabel
        });
      } else {
        // Remove option from selected options
        const index = selectedOptions[questionId].findIndex(opt => opt.id === optionId);
        if (index !== -1) {
          selectedOptions[questionId].splice(index, 1);
        }
      }
      
      // Update UI
      updateSelectedOptionsUI(questionId);
      updateResultPreview();
    });
  });
  
  // Function to update selected options UI
  function updateSelectedOptionsUI(questionId) {
    const container = document.getElementById(questionId);
    const selectedOptionsContainer = container.querySelector('.selected-options');
    selectedOptionsContainer.innerHTML = '';
    
    selectedOptions[questionId].forEach(option => {
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.innerHTML = `
        ${option.text}
        <span class="chip-remove" data-id="${option.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </span>
      `;
      selectedOptionsContainer.appendChild(chip);
      
      // Add event listener to remove button
      const removeButton = chip.querySelector('.chip-remove');
      removeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        const optionId = this.dataset.id;
        
        // Uncheck the checkbox
        document.getElementById(optionId).checked = false;
        
        // Remove option from selected options
        const index = selectedOptions[questionId].findIndex(opt => opt.id === optionId);
        if (index !== -1) {
          selectedOptions[questionId].splice(index, 1);
        }
        
        // Update UI
        updateSelectedOptionsUI(questionId);
        updateResultPreview();
      });
    });
  }
  
  // Function to update result preview
  function updateResultPreview() {
    let result = 'Создай картинку как будет выглядеть дизайн с таким описанием:\n\n';
    
    for (const questionId in selectedOptions) {
      const selected = selectedOptions[questionId];
      if (selected.length > 0) {
        result += `${questionTitles[questionId]}: ${selected.map(o => o.text).join(', ')}\n`;
      }
    }
    
    resultPreview.textContent = result;
  }
  
  // Copy to clipboard functionality
  copyButton.addEventListener('click', function() {
    const text = resultPreview.textContent;
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(function() {
      // Show toast
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
      
      // Close all dropdowns
      dropdownContainers.forEach(container => {
        container.classList.remove('open');
      });
    }).catch(function(err) {
      console.error('Could not copy text: ', err);
    });
  });
});
