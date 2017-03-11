package controllers;

import models.Book;
import org.h2.store.fs.FileUtils;
import org.h2.util.IOUtils;
import play.Logger;
import play.api.Play;
import play.data.FormFactory;
import play.db.jpa.JPAApi;
import play.db.jpa.Transactional;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;

import javax.inject.Inject;
import java.io.*;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

import static play.libs.Json.toJson;
//import static sun.plugin2.util.PojoUtil.toJson;

public class BookController extends Controller {

    private final FormFactory formFactory;
    private final JPAApi jpaApi;

    @Inject
    public BookController(FormFactory formFactory, JPAApi jpaApi) {
        this.formFactory = formFactory;
        this.jpaApi = jpaApi;
    }

    public Result index() {
        return ok(views.html.index.render());
    }

    @Transactional
    public Result addBook() {
        String fileName = null;
        String path = null;
        //System.out.println();

//        final String path = "/";
        Http.MultipartFormData<File> body = request().body().asMultipartFormData();
        Http.MultipartFormData.FilePart<File> picture = body.getFile("picture");
        if (picture != null) {
            fileName = picture.getFilename();
            String contentType = picture.getContentType();
            File file = picture.getFile();
            System.out.println(contentType);
//
//            Timestamp t = new Timestamp(System.currentTimeMillis());
//            file.renameTo(new File("public/images/"+t.getTime()));
            UUID fileNameId = UUID.randomUUID();
            String fileExtension = getFileExtension(picture.getFilename());
            path = fileNameId + "." + fileExtension;
            file.renameTo(new File("public/images/" + path));

            OutputStream out = null;
            InputStream filecontent = null;

        } else {
            flash("error", "Missing file");
        }

        Book book = formFactory.form(Book.class).bindFromRequest().get();
        System.out.println(book.toString());
        book.cover = path;
        jpaApi.em().persist(book);

        return redirect(routes.BookController.index());
    }

    @Transactional
    public Result editBook(Long id) {
        String fileName = null;
        String fileExtension = "";
        String path = null;
        Http.MultipartFormData<File> body = request().body().asMultipartFormData();
        Http.MultipartFormData.FilePart<File> picture = body.getFile("picture");
        if (picture != null) {
            fileName = picture.getFilename();
            String contentType = picture.getContentType();
            File file = picture.getFile();
            System.out.println(contentType);
            Logger.info(contentType);
            UUID fileNameId = UUID.randomUUID();
            fileExtension = getFileExtension(picture.getFilename());
            path = fileNameId + "." + fileExtension;
            file.renameTo(new File("public/images/" + path));

        }
        Book oldbook = jpaApi.em().find(Book.class, id);
        Book book = formFactory.form(Book.class).bindFromRequest().get();

        oldbook.title = book.title;
        oldbook.author = book.author;
        oldbook.description = book.description;
        oldbook.page = book.page;
        if (fileExtension != "") {oldbook.cover = path;}
        jpaApi.em().merge(oldbook);
        return redirect(routes.BookController.index());

    }

    @Transactional
    public Result deleteBook(Long id) {
        //id = Long.parseLong(request().getQueryString("id"));
        jpaApi.em().remove(jpaApi.em().find(Book.class, id));
        return redirect(routes.BookController.index());
        //return ok("User with id=" + id + " has been deleted");
    }

    @Transactional(readOnly = true)
    public Result getBooks() {
        List<Book> books = (List<Book>) jpaApi.em().createQuery("select p from Book p").getResultList();
        return ok(toJson(books));

    }

    @Transactional(readOnly = true)
    public Result getBook(Long id1) {
        Book book = jpaApi.em().find(Book.class, id1);
        return ok(toJson(book));

    }

    private String getFileExtension(String file) {

        try {
            return file.substring(file.lastIndexOf(".") + 1);
        } catch (Exception e) {
            return ".jpg";
        }
    }


//    @Transactional
//    public  Result upload(String qqfile) {
//        if (request.isNew) {
//
//            FileOutputStream moveTo = null;
//
//            Logger.info("Name of the file %s", qqfile);
//            // Another way I used to grab the name of the file
//            String filename = request.headers.get("x-file-name").value();
//
//            Logger.info("Absolute on where to send %s", Play.getFile("").getAbsolutePath() + File.separator + "uploads" + File.separator);
//
//                InputStream data = request.body;
//
//
//                moveTo = new FileOutputStream(new File(Play.getFile("").getAbsolutePath()) + File.separator + "uploads" + File.separator + filename);
//                IOUtils.copy(data, moveTo);
//
//
//
//        }
//
//
//        renderJSON("{success: true}");
//    }


}
