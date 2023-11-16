import { pipeline, env } from '@xenova/transformers';

// From https://huggingface.co/docs/transformers.js/tutorials/node
class TextSummarizationPipeline {
    static task = 'summarization'
    static model = 'Xenova/distilbart-cnn-6-6'
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            env.localModelPath = './distilbart-cnn-6-6';
            env.allowRemoteModels = false;

            this.instance = pipeline(this.task, this.model, { progress_callback });
        }

        return this.instance;
    }
}

export { TextSummarizationPipeline };