let loader = {
    props: ['text'],
    data: function (){
        return {
        }
    },
    template: `
        <div class="ui">
          <div class="ui active inverted dimmer">
                <div class="ui indeterminate text loader">{{ text }}</div>
            </div>
            <p></p>
        </div>`,
    methods: {
    }
};

export {loader as default}
