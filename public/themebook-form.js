const powerTagDiv = document.getElementById(`power-tags`);
const weaknessTagDiv = document.getElementById(`weakness-tags`);

const newTag = sender => {
	if (sender.id == `new-power-tag`) {
		console.log("new power tag");
	} else {
		console.log("new weakness tag");
	}
}