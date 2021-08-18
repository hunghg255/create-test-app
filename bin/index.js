#!/usr/bin/env node
const { prompt } = require("inquirer");
const { readdirSync } = require("fs");
const { join } = require("path");

const {
  argvToObject,
  createDirectoryContents,
  createGitRepo,
  createProject,
  postProcess,
  showMessage,
} = require("./utils");

const ARGV = argvToObject();
const CURR_DIR = process.cwd();
const CHOICES = readdirSync(join(__dirname, "templates"));
const QUESTIONS = [
  {
    name: "template",
    type: "list",
    message: "What project template would you like to generate?",
    choices: CHOICES,
    when: () => !ARGV.template,
  },
  {
    name: "name",
    type: "input",
    message: "Project name:",
    when: () => !ARGV.name,
    validate: (input) => {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else
        return "Project name may only include letters, numbers, underscores and hashes.";
    },
  },
];

prompt(QUESTIONS).then(async (answers) => {
  answers = Object.assign({}, answers, ARGV);

  const projectChoice = answers.template;
  const projectName = answers.name;
  const templatePath = join(__dirname, "templates", projectChoice);
  const tartgetPath = join(CURR_DIR, projectName);
  const author = "Hieu Nguyen";

  const options = {
    projectName,
    templateName: projectChoice,
    templatePath,
    tartgetPath,
    author,
  };

  if (!createProject(tartgetPath)) {
    return;
  }

  createDirectoryContents(templatePath, projectName, author, CURR_DIR);

  await postProcess(options)

  await createGitRepo()

  showMessage(options);
});
