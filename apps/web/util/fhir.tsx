import {
  Encounter,
  Identifier,
  Patient,
  QuestionnaireItem,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r4";

export const parsePatientMrn = (patient: Patient) => {
  return patient?.identifier?.find((e) =>
    e.type.coding.find((c) => c.code === "MR")
  )?.value;
};

export const parsePatientName = (patient: Patient) => {
  return patient?.name
    .map((e) => `${e.given.join(", ")} ${e.family}`)
    .join(", ");
};

export const parseEncounterId = (identifiers: Identifier[]) => {
  return identifiers?.find((e) => e.type.coding.find((c) => c.code === "ACSN"))
    ?.value;
};

export const flattenQuestionnaireItems = (items: QuestionnaireItem[]) => {
  const flat: QuestionnaireItem[] = [];
  items.forEach((item) => {
    if (item.type === "group") {
      flat.push(...flattenQuestionnaireItems(item.item));
    } else {
      flat.push(item);
    }
  });

  return flat;
};

export const getQuestionnairResponses = (
  questions: QuestionnaireItem[],
  input: any
) => {
  const responseItems: QuestionnaireResponseItem[] = [];

  questions.forEach((question) => {
    if (question.type === "group") {
      responseItems.push({
        linkId: question.linkId,
        text: question.text,
        item: getQuestionnairResponses(question.item, input),
      });
    } else {
      responseItems.push({
        linkId: question.linkId,
        text: question.text,
        answer: getQuestionnairAnswersFromInput(
          question,
          input[question.linkId]
        ),
      });
    }
  });

  return responseItems;
};

export const getQuestionnairAnswersFromInput = (
  item: QuestionnaireItem,
  input: any
): QuestionnaireResponseItemAnswer[] => {
  const answers: QuestionnaireResponseItemAnswer[] = [];
  if (item.type === "quantity") {
    if (input.value && parseInt(input.value)) {
      const selectedUnitCode = item.extension?.find(
        (e) => e.valueCoding?.code === input.unit
      );

      answers.push({
        valueQuantity: {
          value: parseInt(input.value),
          unit: selectedUnitCode?.valueCoding?.code
            ? selectedUnitCode.valueCoding.code
            : input.unit,
          code: selectedUnitCode?.valueCoding?.code
            ? selectedUnitCode.valueCoding.code
            : input.unit,
          system: selectedUnitCode?.valueCoding?.system
            ? selectedUnitCode.valueCoding.system
            : "http://unitsofmeasure.org",
        },
      });
    }
  }

  if (item.type === "decimal") {
    if (input.value && parseInt(input.value)) {
      answers.push({
        valueDecimal: parseInt(input.value),
      });
    }
  }

  if (item.type === "choice") {
    if (input) {
      const selectedAnswer = item.answerOption?.find(
        (e) => e.valueCoding?.code === input
      );
      if (selectedAnswer.valueCoding) {
        answers.push({
          valueCoding: selectedAnswer.valueCoding,
        });
      }
    }
  }

  if (item.type === "string") {
    if (input && input.length > 0) {
      answers.push({
        valueString: input,
      });
    }
  }

  return answers;
};
