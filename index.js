(function () {
	globalThis.overload = function overload(overloads) {
		const lexicons = Object.entries(overloads).map(([signature, callback]) => ({
			lexicon: signature.split(/\s+/).map((arg) => {
				const pure = arg.endsWith("?") ? arg.slice(0, arg.length - 1) : arg;

				if (!["string", "number", "boolean", "object"].includes(pure)) throw new Error(`Unsupported type '${pure}'.`);

				return {
					type: pure as typeof lexicons[0]["lexicon"][0]["type"],
					nullable: arg.endsWith("?"),
				};
			}),
			callback,
		}));

		return function (...args) {
			for (const { lexicon, callback } of lexicons)
				if (
					args.every(
						(arg, i) =>
							(typeof arg === lexicon[i].type && arg !== null) ||
							(typeof arg !== "boolean" && (arg ?? true) && lexicon[i].nullable)
					)
				)
					return callback(...args);

			throw new Error(`No overload matched this call.`);
		};
	}
})();
