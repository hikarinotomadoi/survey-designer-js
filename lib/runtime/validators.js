import validate from 'validate.js';
import S from 'string';

validate.validators.CheckboxQuestion = (valueArray, options) => {
  const errors = [];
  const checkedCount = valueArray.reduce((previousValue, currentValue) =>
    (currentValue.checked === true ? previousValue + 1 : previousValue), 0);
  if (options.minCheckCount > 0 && options.minCheckCount > checkedCount) {
    errors.push(`少なくとも${options.minCheckCount}つ選択してください`);
  }
  if (options.maxCheckCount > 0 && options.maxCheckCount < checkedCount) {
    errors.push(`選択できる数は${options.maxCheckCount}つまでです`);
  }
  if (valueArray.some(value => value.checked && value.freeText !== undefined && S(value.freeText).isEmpty())) {
    errors.push('テキスト欄に入力してください');
  }
  if (valueArray.some(value => value.checked && value.freeNumber !== undefined && S(value.freeNuber).isEmpty())) {
    errors.push('テキスト欄に数値を入力してください');
  }

  return errors;
};

validate.validators.RadioQuestion = (value) => {
  const errors = [];
  if (!value) {
    errors.push('選択してください');
  }
  if (value !== undefined && value.freeText !== undefined && S(value.freeText).isEmpty()) {
    errors.push('テキスト欄に入力してください');
  }
  if (value !== undefined && value.freeNumber !== undefined && S(value.freeText).isEmpty()) {
    errors.push('テキスト欄に数値を入力してください');
  }

  return errors;
};

export default validate;