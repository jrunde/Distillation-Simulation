package controllers;

import org.json.*;
import akka.actor.*;
import play.api.libs.json.*;
import java.io.*;

public class MatlabController {

	private ActorRef listener;

	public MatlabController() {

		// Set up instance variables
	}

	public String getMsg() {

		return "Is this working?";
	}
}
