import CategoriesLogo from '../assets/Widget_alt.png';
import DashBoardLogo from '../assets/darhboard_alt.png';
import AddOnLogo from '../assets/drink.png';
import CodacityLogo from '../assets/CodacityLogo.png';
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export function AppSidebar2({ Categories, onCategoryChange, handleContentView }) {
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([...Categories]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCategories([...Categories]);
  }, [Categories]);

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };


  return (
    <Sidebar  style={{ backgroundColor: "#f0f0f0" }}>
      <SidebarContent>

        {/* Orders Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className='mt-6'>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Orders">
                  <div className='w-full flex gap-2 content-center text-lg items-center uppercase rounded-lg font-montserrat-600 border-2 border-blue'
                  onClick={() => handleContentView('orders')}>
                    <img src={DashBoardLogo} alt="" className='h-5 w-5 ml-2' />
                    <h2>Orders</h2>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Availibility Section */}
        <SidebarGroup>
        <SidebarGroupLabel className='font-montserrat-700 mb-2 -mt-3 text-sm'>Availability</SidebarGroupLabel>
          <SidebarGroupContent className='flex flex-col gap-5'>

            {/* Categories Section */}
            <SidebarMenu>
              <Collapsible open={showCategories} onOpenChange={setShowCategories} className='-mt-2.5'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Categories" onClick={() => setShowCategories(!showCategories)}>
                      <div className="w-full flex gap-2 text-lg items-center uppercase rounded-lg font-montserrat-600 border-2 border-blue"
                      onClick={() => handleContentView('category')}>
                        <img src={CategoriesLogo} alt="" className='h-5 w-5 ml-2' />
                        <h2>Categories</h2>
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {loading ? (
                        <div>Loading categories...</div>
                      ) : error ? (
                        <div>{error}</div>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <SidebarMenuSubItem key={category}>
                            <SidebarMenuSubButton asChild>
                              <div
                                key={category}
                                className={`flex relative gap-3 rounded-3xl py-2 -my-1 items-center border-2 border-blue ${
                                  selectedCategory === category ? "shadow-[0_0_6.4px_0_#3295E8]" : ""
                                } mt-2`}
                              >
                                <input
                                  type="radio"
                                  name="categories"
                                  id={category}
                                  onChange={() => handleCategorySelection(category)}
                                  checked={selectedCategory === category}
                                  hidden
                                />
                                <label htmlFor={category} className="font-montserrat-500 uppercase text-xs">
                                  {category}
                                </label>
                              </div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))
                      ) : (
                        <div className="text-center mt-2">No categories up till now...</div>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>

            {/* Addons Section */}
            <SidebarMenu className='-mt-2'>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Add-Ons">
                      <div className="w-full flex gap-2 text-lg items-center uppercase rounded-lg font-montserrat-600 border-2 border-blue"
                      onClick={() => handleContentView('addons')}>
                        <img src={AddOnLogo} alt="" className="h-5 w-5 ml-2" />
                        <h2>Add-Ons</h2>
                      </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className='-mt-2.5 h-10 w-10 rounded-lg border-2 border-blue'>
                  <SidebarMenuButton>
                    <a href="https://codacitysolutions.com/" target='_black' className='flex justify-center items-center h-10 w-10 scale-150'>
                        <img src={CodacityLogo} alt="" className='mt-1.5'/>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
