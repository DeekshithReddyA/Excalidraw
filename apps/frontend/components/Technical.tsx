import { Code, Git, GitBranch, LinkedIn, Package, Parallel, Refresh, Twitter } from "@repo/ui/icons";

export function Technical() {
  return (
    <>
    <div className="flex flex-col items-center justify-center w-full mt-10">
      <div className="text-3xl font-semibold">
        Built with Modern Architecture
      </div>
      <div className="text-xl font-semibold my-4">Monorepo/Turborepo</div>
      <div className="grid grid-cols-2">
        <div className="m-6 col-span-1">
          <div className="p-6 border shadow-lg">
            <div>
              <div className="flex items-start space-x-2">
                <div className="p-2 rounded-full bg-blue-200/70 text-blue-600">
                  <GitBranch size={32} />
                </div>
                <div className="">
                  <div className="text-xl font-semibold">
                    Monorepo Structure
                  </div>
                  <div className="my-2">
                    Our codebase is organized in a monorepo structure, allowing
                    us to maintain multiple packages and applications in a
                    single repository with shared configuration and
                    dependencies.
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-200/90">
                <div>excalidraw-clone/</div>
                <div>├─ apps/</div>
                <div className="flex space-x-20">
                  <div className="">│ ├─ web/</div>
                  <div># NextJS frontend</div>
                </div>
                <div className="flex space-x-20">
                  <div> │ └─ api/ </div>
                  <div># Backend services</div>
                </div>
                <div>├─ packages/</div>
                <div className="flex space-x-20">
                  <div> │ ├─ ui/ </div>
                  <div># Shared UI components</div>
                </div>
                <div className="flex space-x-16">
                  <div> │ ├─ utils/ </div>
                  <div># Common utilities</div>
                </div>
                <div className="flex space-x-14">
                  <div> │ └─ types/ </div>
                  <div># Shared TypeScript types</div>
                </div>
                <div className="flex space-x-12">
                  <div> └─ turbo.json </div>
                  <div># Turborepo configuration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="m-6 col-span-1">
          <div className="p-6 border shadow-lg">
            <div>
              <div className="flex items-start space-x-2">
                <div className="p-2 rounded-full bg-green-200/70 text-green-600">
                  <Refresh size={32} />
                </div>
                <div className="">
                  <div className="text-xl font-semibold">
                    Turborepo Benefits
                  </div>
                  <div className="my-2">
                  Turborepo provides intelligent build system that makes our development workflow faster and more efficient with features like caching, parallel execution, and incremental builds.
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="m-2 col-span-1">
                  <div className="p-2 border shadow-md bg-slate-200/90">
                    <div className="flex flex-col items-center">
                      <div className="text-violet-600 mb-1">
                        <Code size={30}/>
                      </div>
                      <div className="text-lg font-semibold mb-1">Code Sharing</div>
                      <div>Reuse code across applications</div>
                    </div>
                  </div>
                </div>
                <div className="m-2 col-span-1">
                  <div className="p-2 border shadow-md bg-slate-200/90">
                    <div className="flex flex-col items-center">
                      <div className="text-yellow-600 mb-1">
                        <Package size={30}/>
                      </div>
                      <div className="text-lg font-semibold mb-1">Dependency Management</div>
                      <div>Simplified versioning</div>
                    </div>
                  </div>
                </div>
                <div className="m-2 col-span-1">
                  <div className="p-2 border shadow-md bg-slate-200/90">
                    <div className="flex flex-col items-center">
                      <div className="text-red-600 mb-1">
                        <Parallel size={30}/>
                      </div>
                      <div className="text-lg font-semibold mb-1">Parallel Execution</div>
                      <div>Faster build times</div>
                    </div>
                  </div>
                </div>
                <div className="m-2 col-span-1">
                  <div className="p-2 border shadow-md bg-slate-200/90">
                    <div className="flex flex-col items-center">
                      <div className="text-blue-600 mb-1">
                        <Refresh size={30}/>
                      </div>
                      <div className="text-lg font-semibold mb-1">Incremental Builds</div>
                      <div>Only rebuild what changed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

      </div>
    </div>
    <div className="h-20 border border-t-2 flex justify-between items-center">
      <div className="ml-12 mt-2">
        <div className="text-lg font-semibold">Excalidraw Clone</div>
        <div className="text-xs ml-1">Built by Deekshith Reddy</div>
      </div>
      <div className="flex justify-around items-center space-x-4 mr-12 mt-2">
        <a className="cursor-pointer hover:scale-[1.1] transition-all duration-300"
        href="https://github.com/DeekshithReddyA/"
        target="_blank"
        >
          <Git size={20} />
        </a>
        <a className="cursor-pointer hover:scale-[1.1] transition-all duration-300"
        href="https://x.com/Deekshith1910"
        target="_blank">
          <Twitter size={22} />
        </a>
        <a className="cursor-pointer hover:scale-[1.1] transition-all duration-300"
        href="https://www.linkedin.com/in/deekshithreddy1910"
        target="_blank">
          <LinkedIn size={20} />
        </a>
      </div>
    </div>
    </>
  );
}
