const textInput = $('#textInput');
const colorInputsContainer = $('#colorInputs');
const output = $('#output');
const textAreaOutput = $('#textAreaOutput');
const copyButton = $('#copyButton');

function createColorInput(value) {
  return $('<input>').addClass('colorInput form-control form-control-color').attr('type', 'color').val(value);
}

function createRemoveButton() {
  return $('<button>').addClass('removeColor btn btn-danger btn-sm').html('<i class="fas fa-times"></i>').on('click', function() {
    $(this).closest('.colorInputContainer').remove();
    updateOutputAndResize();
  });
}

function addColorInputToContainer(colorValue) {
  const colorInput = createColorInput(colorValue);
  const removeButton = createRemoveButton();
  const colorInputContainer = $('<div>').addClass('colorInputContainer position-relative d-inline-block me-2 mb-2').append(colorInput).append(removeButton);
  colorInputsContainer.append(colorInputContainer);
  colorInputContainer.trigger('colorCreated');
}

function updateOutputAndResize() {
  const text = textInput.val();
  const colors = getColors();
  const colorOutput = applyColorsToText(text, colors);
  output.html(colorOutput.html);
  textAreaOutput.text(colorOutput.text);
  autoResizeDiv();
}

function copyToClipboard() {
  const textToCopy = textAreaOutput.text();
  navigator.clipboard.writeText(textToCopy)
  const originalText = copyButton.text();
  copyButton.text('Copied!');
  setTimeout(() => {
    copyButton.text(originalText);
  }, 2000);
}

function getColors() {
  return $('.colorInput').map((_, el) => $(el).val()).get();
}

function applyColorsToText(text, colors) {
  // If no colors provided, use default gradient colors
  if (colors.length === 0) {
    colors = ['#00ffff', '#ff69b4']; // Default aqua to hot pink gradient
  }
  
  const nonSpaceLength = text.replace(/\s/g, '').length;
  const colorScale = chroma.scale(colors).mode('lch').colors(nonSpaceLength);
  let htmlOutput = '';
  let textOutput = '/nick ';
  let colorIndex = 0;
  
  // Get formatting options (only one can be selected now)
  const isBold = $('#boldCheck').is(':checked');
  const isItalic = $('#italicCheck').is(':checked');
  const isUnderline = $('#underlineCheck').is(':checked');
  const isStrike = $('#strikeCheck').is(':checked');
  
  // Check if any formatting is selected
  const hasFormatting = isBold || isItalic || isUnderline || isStrike;
  
  // Build formatting codes (only one will be true)
  let formatCodes = '';
  if (isBold) formatCodes += '&&l';
  if (isItalic) formatCodes += '&&o';
  if (isUnderline) formatCodes += '&&n';
  if (isStrike) formatCodes += '&&m';
  
  for(let char of text) {
    const isSpace = !char.trim();
    const currentColor = isSpace ? colorScale[Math.max(0, colorIndex - 1)] : colorScale[colorIndex];
    if(!isSpace) colorIndex++;
    
    // Generate HTML preview with formatting
    let htmlChar = char;
    if (isBold) htmlChar = `<strong>${htmlChar}</strong>`;
    if (isItalic) htmlChar = `<em>${htmlChar}</em>`;
    if (isUnderline) htmlChar = `<u>${htmlChar}</u>`;
    if (isStrike) htmlChar = `<s>${htmlChar}</s>`;
    htmlOutput += `<span style="color:${currentColor}">${htmlChar}</span>`;
    
    // Generate Minecraft gradient format with formatting
    if (!isSpace) {
      const hexColor = currentColor.replace('#', '');
      if (hasFormatting) {
        textOutput += `&#${hexColor}${formatCodes}${char}`;
      } else {
        // Just gradient colors with & when no formatting is selected
        textOutput += `&#${hexColor}&${char}`;
      }
    } else {
      textOutput += char;
    }
  }
  
  return {
    html: htmlOutput,
    text: textOutput
  };
}

function autoResizeDiv() {
  textAreaOutput.css('height', 'auto');
  const newHeight = textAreaOutput[0].scrollHeight;
  textAreaOutput.css('height', newHeight + 'px');
}

function initializeDarkModeToggle() {
  const darkModeToggle = $('#darkModeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(prefersDarkScheme) {
    toggleDarkMode(true);
    darkModeToggle.prop('checked', true);
  }
  darkModeToggle.on('change', () => {
    toggleDarkMode(darkModeToggle.is(':checked'));
  });
}

function toggleDarkMode(isDark) {
  $('body').toggleClass('bg-dark text-white', isDark);
}
colorInputsContainer.on('input', '.colorInput', function() {
  updateOutputAndResize();
  $(this).trigger('colorValueChanged');
});
colorInputsContainer.on('colorCreated', '.colorInputContainer', function() {
  updateOutputAndResize();
});
textInput.on('input', function() {
  updateOutputAndResize();
  $(this).trigger('textChanged');
});
$('#addColor').on('click', () => addColorInputToContainer('#ffffff'));
copyButton.on('click', () => copyToClipboard());

// Add event listeners for formatting radio buttons
$('input[name="formatting"]').on('change', function() {
  updateOutputAndResize();
});

initializeDarkModeToggle();
addColorInputToContainer('#00ffff'); // Aqua
addColorInputToContainer('#ff69b4'); // Hot Pink
textInput.val('SteveBuilder123'); // Default Minecraft nickname
autoResizeDiv();
updateOutputAndResize(); // Update with default nickname

// Symbols functionality
const symbols = [
  '☠', '☮', '☯', '♠', 'Ω', '♤', '♣', '♧', '♥', '♡', '♦', '♢', '♔', '♕', '♚', '♛', '⚜', '★', '☆', '✮', '✯', '☄', '☾', '☽', '☼', '☀', '☁', '☂', '☃', '☻', '☺', '☹', '۞', '۩', 'εїз', 'Ƹ̵̡Ӝ̵̨̄Ʒ', 'ξЖЗ', 'εжз', '☎', '☏', '¢', '☚', '☛', '☜', '☝', '☞', '☟', '✍', '✌', '☢', '☣', '♨', '๑', '❀', '✿', 'ψ', '♆', '☪', '♪', '♩', '♫', '♬', '✄', '✂', '✆', '✉', '✦', '✧', '♱', '♰', '∞', '♂', '♀', '☿', '❤', '❥', '❦', '❧', '™', '®', '©', '✖', '✗', '✘', '♒',
  '■', '□', '▢', '▲', '△', '▼', '▽', '◆', '◇', '○', '◎', '●', '◯', 'Δ', '◕', '◔', 'ʊ', 'ϟ', 'ღ', 'ツ', '回', '₪', '™', '©', '®', '¿', '¡', '½', '⅓', '⅔', '¼', '¾', '⅛', '⅜', '⅝', '⅞', '℅', '№', '⇨', '❝', '❞', '#', '&', '℃', '∃', '∧', '∠', '∨', '∩', '⊂', '⊃', '∪', '⊥', '∀', 'Ξ', 'Γ', 'ɐ', 'ə', 'ɘ', 'ε', 'β', 'ɟ', 'ɥ', 'ɯ', 'ɔ', 'и', '๏', 'ɹ', 'ʁ', 'я', 'ʌ', 'ʍ', 'λ', 'ч', '∞', 'Σ', 'Π', '➀', '➁', '➂', '➃', '➄', '➅', '➆', '➇', '➈', '➉',
  'Ⓐ', 'Ⓑ', 'Ⓒ', 'Ⓓ', 'Ⓔ', 'Ⓕ', 'Ⓖ', 'Ⓗ', 'Ⓘ', 'Ⓙ', 'Ⓚ', 'Ⓛ', 'Ⓜ', 'Ⓝ', 'Ⓞ', 'Ⓟ', 'Ⓠ', 'Ⓡ', 'Ⓢ', 'Ⓣ', 'Ⓤ', 'Ⓥ', 'Ⓦ', 'Ⓧ', 'Ⓨ', 'Ⓩ', 'ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ', 'ⓕ', 'ⓖ', 'ⓗ', 'ⓘ', 'ⓙ', 'ⓚ', 'ⓛ', 'ⓜ', 'ⓝ', 'ⓞ', 'ⓟ', 'ⓠ', 'ⓡ', 'ⓢ', 'ⓣ', 'ⓤ', 'ⓥ', 'ⓦ', 'ⓧ', 'ⓨ', 'ⓩ', '{', '｡', '^', '◕', '‿', '◕', '^', '(', '◕', '^', '^', '◕', ')', '✖', '✗', '✘', '♒', '♬', '✄', '✆', '✦', '✧', '♱', '♰', '♂', '♀', '☿', '❤', '❥', '❦', '❧', '™', '®', '©', '♡', '♦', '♢', '♔', '♕', '♚', '♛', '★', '☆', '✮', '✯', '☄', '☾', '☽', '☼', '☀', '☁', '☂', '☃', '☻', '☺', '☹', '☮', '۞', '۩', 'εїз', '☎', '☏', '¢', '☚', '☛', '☜', '☝', '☞', '☟', '✍', '✌', '☢', '☣', '☠', '☮', '☯', '♠', '♤', '♣', '♧', '♥', '♨', '๑', '❀', '✿', 'ψ', '☪', '☭', '♪', '♩', '♫', '℘', 'ℑ', 'ℜ', 'ℵ', '♏', 'η', 'α', 'ʊ', 'ϟ', 'ღ', 'ツ', '回', '₪', '™', '©', '®', '¿', '¡', '½', '⅓', '⅔', '¼', '¾', '⅛', '⅜', '⅝', '⅞', '℅', '№', '⇨', '❝', '❞', '◠', '◡', '╭', '╮', '╯', '╰', '★', '☆', '⊙', '¤', '㊣', '★', '☆', '♀', '◆', '◇', '▆', '▇', '█', '█', '■', '▓', '回', '□', '〓', '≡', '╝', '╚', '╔', '╗', '╬', '═', '╓', '╩', '┠', '┨', '┯', '┷', '┏', '┓', '┗', '┛', '┳', '⊥', '﹃', '﹄', '┌', '┐', '└', '┘', '∟', '「', '」', '↑', '↓', '→', '←', '↘', '↙', '♀', '♂', '┇', '┅', '﹉', '﹊', '﹍', '﹎', '╭', '╮', '╰', '╯', '*', '^', '_', '^', '*', '^', '*', '^', '^', '-', '^', '^', '_', '^', '^', '︵', '^', '∵', '∴', '‖', '︱', '︳', '︴', '﹏', '﹋', '﹌', '♂', '♀', '♥', '♡', '☜', '☞', '☎', '☏', '⊙', '◎', '☺', '☻', '►', '◄', '▧', '▨', '♨', '◐', '◑', '↔', '↕', '▪', '▫', '☼', '♦', '▀', '▄', '█', '▌', '▐', '░', '▒', '▬', '♦', '◊', '◦', '☼', '♠', '♣', '▣', '▤', '▥', '▦', '▩', 'ぃ', '◘', '◙', '◈', '♫', '♬', '♪', '♩', '♭', '♪', 'の', '☆', '→', 'あ', '￡', '❤', '｡', '◕', '‿', '◕', '｡', '✎', '✟', 'ஐ', '≈', '๑', '۩', '۩', '..', '..', '۩', '۩', '๑', '๑', '۩', '۞', '۩', '๑', '✲', '❈', '➹', '~', '.', '~', '◕', '‿', '-', '｡', '☀', '☂', '☁', '【', '】', '┱', '┲', '❣', '✚', '✪', '✣', '✤', '✥', '✦', '❉', '❥', '❦', '❧', '❃', '❂', '❁', '❀', '✄', '☪', '☣', '☢', '☠', '☭', '♈', '✓', '✔', '✕', '✖', '㊚', '㊛', '*', '.', ':', '｡', '✿', '*', 'ﾟ', "'", 'ﾟ', '･', '⊙', '¤', '㊣', '★', '☆', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '⊮', '⊯', '⊰', '⊱', '⊲', '⊳', '⊴', '⊵', '⊶', '⊷', '⊸', '⊹', '⊺', '⊻', '⊼', '⊽', '⊾', '⊿', '⋀', '⋁', '⋂', '⋃', '⋄', '⋅', '⋆', '⋇', '⋈', '⋉', '⋊', '⋋', '⋌', '⋍', '⋎', '⋏', '⋐', '⋑', '⋒', '⋓', '⋔', '⋕', '⋖', '⋗', '⋘', '⋙', '⋚', '⋛', '⋜', '⋝', '⋞', '⋟', '⋠', '⋡', '⋢', '⋣', '⋤', '⋥', '⋦', '⋧', '⋨', '⋩', '⋪', '⋫', '⋬', '⋭', '⋮', '⋯', '⋰', '⋱', '⋲', '⋳', '⋴', '⋵', '⋶', '⋷', '⋸', '⋹', '⋺', '⋻', '⋼', '⋽', '⋾', '⋿', '⌀', '⌁', '⌂', '⌃', '⌄', '⌅', '⌆', '⌇', '⌈', '⌉', '⌊', '⌋'
];

function populateSymbolsModal() {
  const symbolsContainer = $('#symbolsContainer');
  symbolsContainer.empty();
  
  symbols.forEach(symbol => {
    const symbolBtn = $('<div>')
      .addClass('symbol-btn')
      .text(symbol)
      .attr('title', `Insert ${symbol}`)
      .on('click', () => insertSymbolAtCursor(symbol));
    
    symbolsContainer.append(symbolBtn);
  });
}

function insertSymbolAtCursor(symbol) {
  const textInputElement = textInput[0];
  const cursorPosition = textInputElement.selectionStart;
  const textValue = textInput.val();
  
  // Insert symbol at cursor position
  const newText = textValue.slice(0, cursorPosition) + symbol + textValue.slice(cursorPosition);
  textInput.val(newText);
  
  // Update cursor position after the inserted symbol
  const newCursorPosition = cursorPosition + symbol.length;
  textInputElement.setSelectionRange(newCursorPosition, newCursorPosition);
  
  // Focus back to input and update output
  textInputElement.focus();
  updateOutputAndResize();
  
  // Close modal
  $('#symbolsModal').modal('hide');
}

// Initialize symbols modal when page loads
populateSymbolsModal();
