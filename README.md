# Example reaction time ROAR-app

This is an example ROAR-App using the jsPsych Pavlovia reaction time task but with the ROAR-App template.

## Usage

Type

```bash
npm install
```

to install dependencies. Then use

```bash
npm run build
```

to build the website in the `dist` directory. To view your website, type

```bash
npm start
```

which will open up your experiment in a browser and automatically update when you make changes to the source code.

## The query string

This example uses the query string to retrieve the participant ID. For example, when you type `npm start`, you should append `?participant=your-participant-id` to the url, where "your-participant-id" is the desired participant ID.

## How to use this example

We anticipate that ROAR scientists might use this example as a template for their own experiments. To do so,

1. [Fork this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo).
2. Edit your experiment in the `src` directory. Place any assets in subdirectories inside of `src`. For a more full featured example, see [the ROAR-SWR repository](https://github.com/yeatmanlab/ROAR3).
3. Push your changes to your own fork.
4. Deploy changes to your website.
