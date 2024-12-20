import { ExerciseHintExplanationInterface } from 'app/entities/quiz/quiz-question.model';
import { escapeStringForUseInRegex } from 'app/shared/util/global.utils';
import { MonacoQuizExplanationAction } from 'app/shared/monaco-editor/model/actions/quiz/monaco-quiz-explanation.action';
import { MonacoQuizHintAction } from 'app/shared/monaco-editor/model/actions/quiz/monaco-quiz-hint.action';

const hintOrExpRegex = new RegExp(
    escapeStringForUseInRegex(`${MonacoQuizExplanationAction.IDENTIFIER}`) + '|' + escapeStringForUseInRegex(`${MonacoQuizHintAction.IDENTIFIER}`),
    'g',
);

/**
 * Parse the markdown text and apply the result to the target object's data
 *
 * The markdown text is split at MonacoQuizHintAction.IDENTIFIER and MonacoQuizExplanationAction.IDENTIFIER tags.
 *  => First part is text. Everything after MonacoQuizHintAction.IDENTIFIER is Hint, anything after MonacoQuizExplanationAction.IDENTIFIER is explanation
 *
 * @param markdownText {string} the markdown text to parse
 * @param targetObject {object} the object that the result will be saved in. Fields modified are 'text', 'hint' and 'explanation'.
 */
export function parseExerciseHintExplanation(markdownText: string, targetObject: ExerciseHintExplanationInterface) {
    if (!markdownText || !targetObject) {
        return;
    }
    // split markdownText into main text, hint and explanation
    const markdownTextParts = markdownText.split(hintOrExpRegex);
    targetObject.text = markdownTextParts[0].trim();
    if (markdownText.indexOf(MonacoQuizHintAction.IDENTIFIER) !== -1 && markdownText.indexOf(MonacoQuizExplanationAction.IDENTIFIER) !== -1) {
        if (markdownText.indexOf(MonacoQuizHintAction.IDENTIFIER) < markdownText.indexOf(MonacoQuizExplanationAction.IDENTIFIER)) {
            targetObject.hint = markdownTextParts[1].trim();
            targetObject.explanation = markdownTextParts[2].trim();
        } else {
            targetObject.hint = markdownTextParts[2].trim();
            targetObject.explanation = markdownTextParts[1].trim();
        }
    } else if (markdownText.indexOf(MonacoQuizHintAction.IDENTIFIER) !== -1) {
        targetObject.hint = markdownTextParts[1].trim();
        targetObject.explanation = undefined;
    } else if (markdownText.indexOf(MonacoQuizExplanationAction.IDENTIFIER) !== -1) {
        targetObject.hint = undefined;
        targetObject.explanation = markdownTextParts[1].trim();
    } else {
        targetObject.hint = undefined;
        targetObject.explanation = undefined;
    }
}

/**
 * generate the markdown text for the given source object
 *
 * The markdown is generated according to these rules:
 *
 * 1. First the value of sourceObject.text is inserted
 * 2. If hint and/or explanation exist, they are added after the text with a linebreak and tab in front of them
 * 3. Hint starts with [-h], explanation starts with [-e]
 *
 * @param sourceObject
 * @return {string}
 */
export function generateExerciseHintExplanation(sourceObject: ExerciseHintExplanationInterface) {
    return !sourceObject.text
        ? ''
        : sourceObject.text +
              (sourceObject.hint ? '\n\t' + MonacoQuizHintAction.IDENTIFIER + ' ' + sourceObject.hint : '') +
              (sourceObject.explanation ? '\n\t' + MonacoQuizExplanationAction.IDENTIFIER + ' ' + sourceObject.explanation : '');
}
