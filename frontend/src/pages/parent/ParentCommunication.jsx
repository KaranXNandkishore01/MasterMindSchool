import { MessageSquare, Send, User } from 'lucide-react';

const ParentCommunication = () => {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Communication</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-1 min-h-[500px]">
         {/* Contacts List */}
         <div className="w-1/3 border-r border-gray-100 bg-gray-50 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare size={18} className="text-blue-600" /> Recent Chats
               </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
               <div className="p-4 border-b border-gray-100 bg-blue-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center shrink-0">
                        <User size={20} className="text-blue-700" />
                     </div>
                     <div className="overflow-hidden">
                        <h4 className="font-bold text-gray-800 truncate">Mr. Vikram Singh</h4>
                        <p className="text-xs text-gray-500 truncate">Class Teacher (X-A)</p>
                     </div>
                  </div>
               </div>
               <div className="p-4 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors opacity-60">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                        <User size={20} className="text-gray-600" />
                     </div>
                     <div className="overflow-hidden">
                        <h4 className="font-bold text-gray-600 truncate">Admin Office</h4>
                        <p className="text-xs text-gray-400 truncate">Queries regarding fees...</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Chat Area */}
         <div className="w-2/3 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white shrink-0">
               <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <User size={20} className="text-blue-700" />
               </div>
               <div>
                  <h4 className="font-bold text-gray-800">Mr. Vikram Singh</h4>
                  <p className="text-xs text-green-500 font-medium">Online</p>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
               <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] shadow-sm">
                     <p className="text-sm">Hello Sir, how is Rohan performing in Physics?</p>
                     <p className="text-[10px] text-blue-200 text-right mt-1">10:45 AM</p>
                  </div>
               </div>
               <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] shadow-sm">
                     <p className="text-sm">Rohan is doing well, but he needs to focus more on numericals. I have sent some extra practice sheets via the Study Material portal.</p>
                     <p className="text-[10px] text-gray-400 text-right mt-1">11:15 AM</p>
                  </div>
               </div>
            </div>
            
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
               <div className="flex items-center gap-2">
                  <input 
                     type="text" 
                     placeholder="Type a message..." 
                     className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors shrink-0">
                     <Send size={18} />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
export default ParentCommunication;
