package controllers;

import play.*;
import play.api.libs.json.Reads.*;
import play.api.libs.functional.syntax.*;
import play.mvc.*;
import views.html.*;
import play.api.libs.json.*;

public class Application extends Controller {

	static MatlabController mat = new MatlabController();
	
    public static Result index() {
        return ok(index.render(mat.getMsg()));
    }
}
