import { findByName, findByProps } from "@bunny/metro";
import { after } from "@bunny/patcher";
import { storage } from "@bunny/plugin";
import { React, NavigationNative } from "@bunny/metro/common";
import { showActionSheet } from "@bunny/ui/components";
import { Forms, Button, TextInput, Flex, ScrollView } from "@bunny/ui/components";

const { FormSection, FormRow } = Forms;
const GifPicker = findByName("GifPicker", false);
const Gif = findByName("Gif", false);

// --- Settings UI Component ---
function Settings() {
    const [name, setName] = React.useState("");
    storage.categories ??= ["Funny", "Reaction"];

    return (
        <ScrollView style={{ flex: 1 }}>
            <FormSection title="Manage GIF Categories">
                <Flex direction="row" style={{ padding: 10 }}>
                    <TextInput
                        placeholder="New Category..."
                        value={name}
                        onChange={(v: string) => setName(v)}
                        style={{ flex: 1, marginRight: 10 }}
                    />
                    <Button text="Add" size="small" onPress={() => {
                        if (name && !storage.categories.includes(name)) {
                            storage.categories.push(name);
                            setName("");
                        }
                    }} />
                </Flex>
                {storage.categories.map((cat, i) => (
                    <FormRow
                        label={cat}
                        trailing={<Button text="Delete" color="red" size="small" onPress={() => storage.categories.splice(i, 1)} />}
                    />
                ))}
            </FormSection>
        </ScrollView>
    );
}

// --- Main Plugin Object ---
export default {
    onLoad: () => {
        storage.gifMap ??= {};       // Maps GIF URL -> Category Name
        storage.activeFilter ??= "All";
        storage.categories ??= [];

        // 1. PATCH: Individual GIF Long Press
        after(Gif, "default", ([{ gif }], res) => {
            res.props.onLongPress = () => {
                showActionSheet({
                    title: "Assign GIF to Category",
                    options: [
                        ...storage.categories.map(cat => ({
                            label: cat,
                            onPress: () => { storage.gifMap[gif.url] = cat; }
                        })),
                        { label: "Remove from Category", isDestructive: true, onPress: () => { delete storage.gifMap[gif.url]; }}
                    ],
                });
            };
        });

        // 2. PATCH: GIF Picker Filtering Logic
        after(GifPicker, "default", (args, res) => {
            const gifGrid = res?.props?.children?.find(c => c?.props?.gifs);
            
            if (gifGrid && storage.activeFilter !== "All") {
                // Filter the list based on the user's selection
                gifGrid.props.gifs = gifGrid.props.gifs.filter(g => 
                    storage.gifMap[g.url] === storage.activeFilter
                );
            }

            // UI Trick: Inject a Category Selector bar at the top of the picker
            // This is simplified; real implementation involves finding the header child
            res.props.children.unshift(
                <ScrollView horizontal style={{ padding: 5, backgroundColor: 'rgba(0,0,0,0.1)' }}>
                    {["All", ...storage.categories].map(cat => (
                        <Button 
                            text={cat} 
                            size="small" 
                            variant={storage.activeFilter === cat ? "primary" : "secondary"}
                            onPress={() => { storage.activeFilter = cat; }}
                            style={{ marginRight: 8 }}
                        />
                    ))}
                </ScrollView>
            );
        });
    },
    onUnload: () => {},
    settings: Settings
};
