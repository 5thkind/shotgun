let message = {
    props: ['title', 'message', 'type'],
    data: function (){
        return {
        }
    },
    template: `
        <div v-if="type === 'success'" class="ui success message">
            <div class="header">
                {{ title }}
            </div>
            <p>{{ message }}</p>
        </div>
        <div v-else-if="type === 'fail'" class="ui negative message">
            <div class="header">
                {{ title }}
            </div>
            <p>{{ message }}</p>
        </div>`,
};

export {message as default}
