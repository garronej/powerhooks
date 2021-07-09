
import * as child_process from "child_process";
import { join as pathJoin } from "path";
import * as fs from "fs";
import { exclude } from "tsafe/exclude";

const projectRootPath = pathJoin(__dirname, "..", "..");

const { allDependencies, packageName } = (() => {

	const parsedPackageJson =
		JSON.parse(
			fs.readFileSync(
				pathJoin(projectRootPath, "package.json")
			).toString("utf8")
		);

	const allDependencies = ["devDependencies", "dependencies"]
		.map(property => Object.keys(parsedPackageJson[property] ?? {}))
		.reduce((prev, curr) => [...prev, ...curr], [])
		.filter(exclude("typescript"));

	const packageName = parsedPackageJson["name"];

	return { allDependencies, packageName };

})();

child_process.execSync(
	`rm -rf ${packageName} ${allDependencies.join(" ")}`,
	{ "cwd": pathJoin(process.env["HOME"]!, ".config", "yarn", "link") }
);

allDependencies.forEach(
	dependency =>
		child_process.execSync(
			"yarn link",
			{
				"cwd": pathJoin(...[
					projectRootPath,
					"node_modules",
					...(
						dependency.includes("@") ?
							dependency.split("/") :
							[dependency]
					)
				])
			}
		)
);

child_process.execSync(
	`yarn link`,
	{ "cwd": projectRootPath }
);

child_process.execSync(
	`yarn link ${packageName} ${allDependencies.join(" ")}`,
	{ "cwd": pathJoin(projectRootPath, "src", "test") }
);
