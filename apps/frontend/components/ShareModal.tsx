import { X } from "@repo/ui/icons";

interface ShareModalProps {
  darkMode: boolean;
  name: string;
  setName: any;
  setModalOpen: any;
  liveCollab: boolean;
  setLiveCollab: any;
  link: string;
}

export function ShareModal(props: ShareModalProps) {
  const inputStyle = `${props.darkMode ? "bg-neutral-800" : "bg-slate-200"} p-2 rounded-lg outline-violet-500`;
  return (
    <div className="absolute z-50 w-screen h-screen backdrop-blur-sm flex items-center justify-center">
      <div
        className={`p-3 rounded-lg shadow-lg flex flex-col items-center justify-center ${props.darkMode ? "text-white border border-neutral-800" : "border text-black"}`}
      >
        <div
          onClick={(e) => {
            e.preventDefault();
            props.setModalOpen(false);
          }}
          className="w-full flex justify-end cursor-pointer"
        >
          <X />
        </div>
        <div className="text-violet-800 text-xl font-bold m-4">
          Live collaboration
        </div>
        <div className="m-4">Invite people to collaborate on your drawing.</div>

        {!props.liveCollab ? (
          <div>
            <div className="text-sm font-semibold m-1">Your name</div>
            <input
              className={inputStyle}
              name="name"
              value={props.name}
              onChange={(e) => {
                props.setName(e.target.value);
              }}
              placeholder="Your name"
            ></input>
            <div
              onClick={(e) => {
                e.preventDefault();
                props.setLiveCollab(true);
              }}
              className={`flex items-center justify-center ${props.darkMode ? "bg-violet-400 text-black" : "bg-violet-500 text-white"} mt-6 mb-4 cursor-pointer md:p-2 p-1 text-xs md:text-sm rounded-lg`}
            >
              Start Collaboration
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm font-semibold">Link</div>
            <input
              readOnly
              className={`${inputStyle}`}
              name="link"
              value={props.link}
            ></input>
            <div onClick={(e) => {
                e.preventDefault();
                props.setLiveCollab(false);
            }}
              className={`flex items-center justify-center ${props.darkMode ? "bg-violet-400 text-black" : "bg-violet-500 text-white"} mt-6 mb-4 cursor-pointer md:p-2 p-1 text-xs md:text-sm rounded-lg`}
            >
              Stop Collaboration
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
