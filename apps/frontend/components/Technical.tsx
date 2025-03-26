import { GitBranch } from "@repo/ui/icons";

export function Technical() {
  return (
    <div className="flex flex-col items-center justify-center w-full mt-10">
      <div className="text-3xl font-semibold">
            Built with Modern Architecture
      </div>
      <div className="text-xl font-semibold my-4">Monorepo & Turborepo</div>
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
                  <div className="mt-2">
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
                    <div className="">
                     │  ├─ web/
                    </div>
                    <div>
                      # NextJS frontend
                    </div>
                </div>
                <div className="flex space-x-20">
                    <div> │   └─ api/ </div>
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
      <div className="col-span-1">sd</div>
      </div>
    </div>
  );
}
