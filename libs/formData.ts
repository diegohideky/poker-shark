import { NextApiRequest } from "next";
import formidable from "formidable";

type ParseFormResult = {
  fields: formidable.Fields;
  files: formidable.Files;
};

export async function parseForm(req: NextApiRequest): Promise<ParseFormResult> {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err); // Reject the promise on error
      }
      resolve({ fields, files }); // Resolve with fields and files
    });
  });
}
